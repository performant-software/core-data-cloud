module CoreDataConnector
  class RelationshipsController < ApplicationController
    # Includes
    include Api::Uploadable
    include ManifestsController
    include UserDefinedFields::Queryable

    # Actions
    before_action :set_project_model_relationship, only: :index

    # Search methods
    search_methods :search_related_records

    protected

    def base_query
      # If we're accessing a single record, do not apply any additional filtering. We'll assume the policy is set up
      # such that the correct access is granted.
      return super if params[:id].present?

      # For an index view, scope the list of relationships to those owned by the project_model_relationship,
      # for the given record type.
      return Relationship.none unless params[:project_model_relationship_id].present? && params[:record_id].present? && params[:record_type].present?

      # Relationships should always to scoped to a project model relationship. For inverse relationships, we'll
      # use the related record.
      if params[:inverse]
        query = Relationship
          .where(
            project_model_relationship_id: params[:project_model_relationship_id],
            related_record_id: params[:record_id],
            related_record_type: params[:record_type]
          )
      else
        query = Relationship
          .where(
            project_model_relationship_id: params[:project_model_relationship_id],
            primary_record_id: params[:record_id],
            primary_record_type: params[:record_type]
          )
      end

      # Include preloads for the different model types
      case model_class
      when Event.to_s
        query = query.preload(params[:inverse] ? { primary_record: [:start_date, :end_date] } : { related_record: [:start_date, :end_date] })
      when Instance.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      when Item.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      when MediaContent.to_s
        query = query.preload(params[:inverse] ? :primary_record : :related_record)
      when Organization.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      when Person.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      when Place.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      when Taxonomy.to_s
        query = query.preload(params[:inverse] ? :primary_record : :related_record)
      when Work.to_s
        query = query.preload(params[:inverse] ? { primary_record: :primary_name } : { related_record: :primary_name })
      end

      # For sorting, left join the polymorphic model we're currently looking at.
      case model_class
      when Event.to_s
        query = query.joins(params[:inverse] ? :inverse_related_event : :related_event).joins(Event.start_date_join, Event.end_date_join)
      when Instance.to_s
        query = query.joins(params[:inverse] ? { inverse_related_instance: :primary_name } : { related_instance: :primary_name })
      when Item.to_s
        query = query.joins(params[:inverse] ? { inverse_related_item: :primary_name } : { related_item: :primary_name })
      when MediaContent.to_s
        query = query.joins(params[:inverse] ? :inverse_related_media_content : :related_media_content)
      when Organization.to_s
        query = query.joins(params[:inverse] ? { inverse_related_organization: :primary_name } : { related_organization: :primary_name })
      when Person.to_s
        query = query.joins(params[:inverse] ? { inverse_related_person: :primary_name } : { related_person: :primary_name })
      when Place.to_s
        query = query.joins(params[:inverse] ? { inverse_related_place: :primary_name } : { related_place: :primary_name })
      when Taxonomy.to_s
        query = query.joins(params[:inverse] ? :inverse_related_taxonomy : :related_taxonomy)
      when Work.to_s
        query = query.joins(params[:inverse] ? { inverse_related_work: :primary_name } : { related_work: :primary_name })
      end

      query
    end

    private

    # Returns the related model class for filtering and sorting.
    def model_class
      if params[:inverse]
        @project_model_relationship.primary_model.model_class
      else
        @project_model_relationship.related_model.model_class
      end
    end

    def resolve_person_query
      query = nil

      table = PersonName.arel_table
      table_name = table.name

      attributes = [
        "#{table_name}.#{table[:last_name].name}",
        "#{table_name}.#{table[:first_name].name}",
        "#{table_name}.#{table[:first_name].name} || ' ' || #{table_name}.#{table[:last_name].name}"
      ]

      attributes.each do |attr|
        q = resolve_search_query(attr)

        if query.nil?
          query = q
        else
          query = query.or(q)
        end
      end

      query
    end

    def search_related_records(query)
      return query unless params[:search].present?

      or_query = nil

      case model_class
      when Event.to_s
        attribute = "#{Event.arel_table.name}.#{Event.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Instance.to_s
        attribute = "#{SourceName.arel_table.name}.#{SourceName.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Item.to_s
        attribute = "#{SourceName.arel_table.name}.#{SourceName.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when MediaContent.to_s
        attribute = "#{MediaContent.arel_table.name}.#{MediaContent.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Organization.to_s
        attribute = "#{OrganizationName.arel_table.name}.#{OrganizationName.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Person.to_s
        or_query = resolve_person_query
      when Place.to_s
        attribute = "#{PlaceName.arel_table.name}.#{PlaceName.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Taxonomy.to_s
        attribute = "#{Taxonomy.arel_table.name}.#{Taxonomy.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      when Work.to_s
        attribute = "#{SourceName.arel_table.name}.#{SourceName.arel_table[:name].name}"
        or_query = resolve_search_query(attribute)
      end

      return query if or_query.nil?

      if query == item_class.all
        query.merge(or_query)
      else
        query.or(or_query)
      end
    end

    def set_project_model_relationship
      @project_model_relationship = ProjectModelRelationship.find(params[:project_model_relationship_id])
    end
  end
end