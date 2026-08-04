module CoreDataConnector
  class ProjectModelsSerializer < BaseSerializer
    # Includes
    include UserDefinedFields::DefineableSerializer

    index_attributes :id, :uuid, :project_id, :name, :name_singular, :model_class, :model_class_view, :slug, :order,
                     project: ProjectsSerializer, user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer

    index_attributes(:has_shares) do |project_model|
      !project_model.project_model_shares.empty?
    end

    show_attributes :id, :uuid, :project_id, :name, :name_singular, :model_class, :model_class_view, :slug,
                    :allow_identifiers, :order, project: ProjectsSerializer,
                    project_model_relationships: [:id, :uuid, :related_model_id, :name, :multiple, :slug,
                                                  :allow_inverse, :inverse_name, :inverse_multiple, :order,
                                                  related_model: ProjectModelsSerializer,
                                                  user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer],
                    inverse_project_model_relationships: [:id, :uuid, :primary_model_id, :name, :multiple, :slug,
                                                          :allow_inverse, :inverse_name, :inverse_multiple, :order,
                                                          primary_model: ProjectModelsSerializer,
                                                          user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer],
                    project_model_accesses: [:id, :project_id, project: ProjectsSerializer],
                    project_model_shares: [:id, :project_model_access_id, project_model_access: ProjectModelAccessesSerializer],
                    user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer

    show_attributes(:has_shares) do |project_model|
      !project_model.project_model_shares.empty?
    end
  end
end