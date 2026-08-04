module CoreDataConnector
  class VersionsController < ApplicationController
    preloads :user

    protected

    def base_query
      scope = super

      if params[:project_id].present?
        authorize project, :show?
        scope = scope.where(project_id: project.id)
      elsif is_valid?
        authorize root_record, :show?
        scope = scope.merge(Version.for_record(root_record))
      else
        return Version.none
      end

      params[:sort_by].present? ? scope :
        scope.order(created_at: :desc, id: :desc)
    end

    def load_records(items)
      versions = [items].flatten

      preload_user_defined_fields versions
      preload_roots versions

      super.merge(
        attribute_changes: method(:attribute_changes),
        user_defined_changes: method(:user_defined_changes),
        root_data: method(:root_data)
      )
    end

    def root_data(root)
      record = @roots[root_key(root)]
      project_model_id = record&.project_model_id || root['project_model_id']

      {
        record_type: root['type']&.demodulize,
        id: root['id'],
        uuid: record&.uuid || root['uuid'],
        display_name: record&.display_name || root['display_name'],
        project_model_id: project_model_id,
        project_model_name: @project_models[project_model_id]&.name,
        deleted: record.nil?
      }
    end

    def attribute_changes(version)
      serialized = {}

      extract_changes(version).each do |attribute, (from, to)|
        next if attribute == 'user_defined'

        serialized[attribute] = { from: from, to: to }
      end

      serialized
    end

    def user_defined_changes(version)
      before, after = extract_changes(version)['user_defined']
      before ||= {}
      after ||= {}

      (before.keys | after.keys).filter_map do |uuid|
        from = before[uuid]
        to = after[uuid]

        next if from == to

        field = @user_defined_fields[uuid]

        {
          uuid: uuid,
          label: field&.column_name || uuid,
          data_type: field&.data_type,
          from: from,
          to: to
        }
      end
    end

    private

    def extract_changes(version)
      if version.object_changes.present?
        version.object_changes
      elsif version.event == 'destroy' && version.object.present?
        version.object.transform_values { |value| [value, nil] }
      else
        {}
      end
    end

    def preload_user_defined_fields(versions)
      uuids = versions.flat_map { |version| user_defined_uuids(version) }.uniq

      @user_defined_fields = UserDefinedFields::UserDefinedField
                               .where(uuid: uuids)
                               .index_by(&:uuid)
    end

    def preload_roots(versions)
      roots = versions.flat_map { |version| Array(version.roots) }

      @roots = {}

      roots.group_by { |root| root['type'] }.each do |type, group|
        klass = root_class(type)
        next if klass.nil?

        scope = klass.where(id: group.map { |root| root['id'] }.uniq)

        if klass.respond_to?(:get_names_table) && klass.get_names_table.present?
          scope = scope.includes(:primary_name)
        end

        scope.each { |record| @roots[[type, record.id]] = record }
      end

      preload_project_models roots
    end

    def preload_project_models(roots)
      ids = roots.filter_map do |root|
        @roots[root_key(root)]&.project_model_id || root['project_model_id']
      end.uniq

      @project_models = ProjectModel.where(id: ids).index_by(&:id)
    end

    def root_key(root)
      [root['type'], root['id']]
    end

    # Guards against types stored on older versions that have since been renamed
    # or removed.
    def root_class(type)
      klass = type&.safe_constantize
      klass if klass.is_a?(Class) && klass < ActiveRecord::Base
    end

    def user_defined_uuids(version)
      uuids = []

      if version.object_changes.present?
        before, after = version.object_changes['user_defined']
        uuids += (before || {}).keys + (after || {}).keys
      end

      if version.object.present?
        uuids += (version.object['user_defined'] || {}).keys
      end

      uuids
    end

    def is_valid?
      record_class.present?
    end

    def root_record
      @root_record ||= record_class.find(params[parent_param])
    end

    def record_class
      resolve_parent
      @record_class
    end

    def parent_param
      resolve_parent
      @parent_param
    end

    def resolve_parent
      return if defined?(@resolved_parent)
      @resolved_parent = true

      @parent_param = params.keys
                            .map(&:to_sym)
                            .select { |key| key.to_s.end_with?('_id') && params[key].present? }
                            .find do |key|
                              klass = audit_root_class(key)
                              @record_class = klass if klass
                              klass
                            end
    end

    def audit_root_class(param)
      klass = "CoreDataConnector::#{param.to_s.delete_suffix('_id').classify}".safe_constantize
      klass if klass.is_a?(Class) && klass.respond_to?(:audit_root?) && klass.audit_root?
    end

    def project
      @project ||= Project.find(params[:project_id])
    end
  end
end