module CoreDataConnector
  class ProjectVariablesSerializer < BaseSerializer
    TYPE_MODEL = 'MODEL'
    TYPE_RELATIONSHIP = 'RELATIONSHIP'
    TYPE_FIELD = 'FIELD'

    def render_show(project)
      return {} if project.nil?

      serialized = []

      project_models = ProjectModel
                         .preload(:user_defined_fields)
                         .preload(project_model_relationships: :user_defined_fields)
                         .preload(inverse_project_model_relationships: :user_defined_fields)
                         .where(project_id: project.id)
                         .order(:name)

      project_models.each do |project_model|
        serialized << transform_value(project_model.id, project_model.name, TYPE_MODEL)
        serialized += transform_fields(project_model.user_defined_fields, project_model.name)
        serialized += transform_relationships(project_model.project_model_relationships, :name, project_model.name)
        serialized += transform_relationships(project_model.inverse_project_model_relationships, :inverse_name, project_model.name)
      end

      serialized
    end

    private

    def transform_fields(user_defined_fields, *names)
      serialized = []

      user_defined_fields.each do |user_defined_field|
        serialized << transform_value(
          user_defined_field.uuid,
          *names,
          user_defined_field.column_name,
          TYPE_FIELD
        )
      end

      serialized
    end

    def transform_relationships(project_model_relationships, name_attribute, names)
      serialized = []

      project_model_relationships.each do |project_model_relationship|
        relationship_name = project_model_relationship.send(name_attribute)

        serialized << transform_value(
          project_model_relationship.id,
          *names,
          relationship_name,
          TYPE_RELATIONSHIP
        )

        serialized += transform_fields(
          project_model_relationship.user_defined_fields,
          *names,
          relationship_name
        )
      end

      serialized
    end

    def transform_value(value, *names)
      name = names.map{ |n| n.upcase.gsub(' ', '_') }.join('_')

      "#{name}=#{value}"
    end
  end
end