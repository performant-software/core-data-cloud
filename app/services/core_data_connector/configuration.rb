module CoreDataConnector
  class Configuration
    attr_reader :project, :settings

    def initialize(project, file)
      @project = project
      @settings = load_settings(file)
    end

    def import_configuration
      project_models = settings[:project_models]
      project_model_relationships = []

      project_model_ids = {}

      project_models.each do |project_model|
        # Create the new project model
        create_project_model project_model, project_model_ids

        # All the relationships to the list of project_model_relationships
        project_model_relationships += project_model[:project_model_relationships]
      end

      project_model_relationships.each do |project_model_relationship|
        create_project_model_relationship project_model_relationship, project_model_ids
      end
    end

    private

    def create_project_model(item, project_model_ids)
      item_attributes = item.slice(:name, :model_class)
      attributes = item_attributes.merge({ project_id: project.id })

      project_model = ProjectModel.create(attributes)
      project_model_ids[item[:id]] = project_model.id

      create_user_defined_fields item[:user_defined_fields], project_model

      project_model
    end

    def create_project_model_relationship(item, project_model_ids)
      primary_model_id = project_model_ids[item[:primary_model_id]]
      related_model_id = project_model_ids[item[:related_model_id]]

      item_attributes = item.slice(:name, :multiple, :allow_inverse, :inverse_name, :inverse_multiple)

      attributes = item_attributes.merge({
        primary_model_id: primary_model_id,
        related_model_id: related_model_id
      })

      project_model_relationship = ProjectModelRelationship.create(attributes)

      create_user_defined_fields item[:user_defined_fields], project_model_relationship

      project_model_relationship
    end

    def create_user_defined_fields(fields, defineable)
      fields.each do |field|
        field_attributes = field.slice(
          :table_name,
          :column_name,
          :data_type,
          :required,
          :searchable,
          :allow_multiple,
          :options,
          :order
        )

        attributes = field_attributes.merge({
          defineable_id: defineable.id,
          defineable_type: defineable.class.to_s
        })

        UserDefinedFields::UserDefinedField.create(attributes)
      end
    end

    def load_settings(file)
      contents = File.read(file.path)
      JSON.parse(contents)&.deep_symbolize_keys
    end
  end
end