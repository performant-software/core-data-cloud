module CoreDataConnector
  module ImportAnalyze
    class Policy

      attr_reader :current_user, :files

      def initialize(current_user, files)
        @current_user = current_user
        @files = files
      end

      # A user can analyze the set of files if they are an admin or have access to the project(s) containing all of the
      # models and relationships they are attempting to import.
      def has_analyze_access?
        return true if current_user.admin?

        project_model_ids = files
                              &.except(Import::FILE_RELATIONSHIPS)
                              &.values
                              &.map{ |v| v[:data]&.map{ |d| d[:import][:project_model_id] } }
                              &.flatten
                              &.uniq

        project_model_relationship_ids = (files.dig(Import::FILE_RELATIONSHIPS, :data) || [])
                                           &.map{ |v| v[:import][:project_model_relationship_id] }
                                           &.flatten
                                           &.uniq

        has_access?(project_model_ids, project_model_relationship_ids)
      end

      # A user can import the set of files if they are an admin or have access to the project(s) containing all of the
      # models and relationships they are attempting to import.
      def has_import_access?
        return true if current_user.admin?

        project_model_ids = files
                              &.except(Import::FILE_RELATIONSHIPS)
                              &.values
                              &.map{ |v| v['data']&.map{ |d| d['project_model_id'] } }
                              &.flatten
                              &.uniq

        project_model_relationship_ids = (files.dig(Import::FILE_RELATIONSHIPS, :data) || [])
                                           &.map{ |v| v['project_model_relationship_id'] }
                                           &.uniq

        has_access?(project_model_ids, project_model_relationship_ids)
      end

      private

      def has_access?(project_model_ids, project_model_relationship_ids)
        # Return false if the data being imported belongs to a model for which the user does not have access
        allowed_project_model_ids = project_models_query.pluck(:id)
        return false unless project_model_ids.all? { |id| allowed_project_model_ids.include?(id) }

        # Return true if we're not importing any relationships
        return true if project_model_relationship_ids.nil? || project_model_relationship_ids.empty?

        # Return false if the relationship data being imported belongs to a model for which the user does not have access
        allowed_project_model_relationship_ids = project_model_relationships_query.pluck(:id)
        return false unless project_model_relationship_ids.all?{ |id| allowed_project_model_relationship_ids.include?(id) }

        # Return true
        true
      end

      def project_models_query
        ProjectModel
          .where(
            Project
              .joins(:user_projects)
              .where(Project.arel_table[:id].eq(ProjectModel.arel_table[:project_id]))
              .where(user_projects: { user_id: current_user.id })
              .where.not(archived: true)
              .arel
              .exists
          )
      end

      def project_model_relationships_query
        ProjectModelRelationship
          .where(
            ProjectModel
              .joins(project: :user_projects)
              .where(
                ProjectModel.arel_table[:id].eq(ProjectModelRelationship.arel_table[:primary_model_id])
                            .or(ProjectModel.arel_table[:id].eq(ProjectModelRelationship.arel_table[:related_model_id])))
              .where(user_projects: { user_id: current_user.id })
              .where.not(project: { archived: true })
              .arel
              .exists
          )
      end
    end
  end
end