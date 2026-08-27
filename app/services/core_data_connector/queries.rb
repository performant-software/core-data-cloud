module CoreDataConnector
  class Queries

    def self.all_fields_by_project(project_id)
      project_models_query(project_id)
        .or(project_model_relationships_query(project_id))
    end

    private

    def self.project_models_query(project_id)
      subquery = ProjectModel
                   .where(ProjectModel.arel_table[:id].eq(UserDefinedFields::UserDefinedField.arel_table[:defineable_id]))
                   .where(project_id: project_id)
                   .arel
                   .exists

      UserDefinedFields::UserDefinedField
        .where(defineable_type: ProjectModel.to_s)
        .where(subquery)
    end

    def self.project_model_relationships_query(project_id)
      subquery = ProjectModelRelationship
                   .where(ProjectModelRelationship.arel_table[:id].eq(UserDefinedFields::UserDefinedField.arel_table[:defineable_id]))
                   .joins(:primary_model, :related_model)
                   .where(primary_model: { project_id: project_id })
                   .or(
                     ProjectModelRelationship
                       .where(ProjectModelRelationship.arel_table[:id].eq(UserDefinedFields::UserDefinedField.arel_table[:defineable_id]))
                       .joins(:primary_model, :related_model)
                       .where(related_model: { project_id: project_id })
                   )
                   .arel
                   .exists

      UserDefinedFields::UserDefinedField
        .where(defineable_type: ProjectModelRelationship.to_s)
        .where(subquery)
    end

  end
end