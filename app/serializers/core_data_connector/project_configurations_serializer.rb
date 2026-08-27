module CoreDataConnector
  class ProjectConfigurationsSerializer < BaseSerializer
    show_attributes :name, project_models: [:id, :name, :model_class,
                                            user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer,
                                            project_model_relationships: [
                                              :primary_model_id, :related_model_id, :name, :multiple, :allow_inverse,
                                              :inverse_name, :inverse_multiple,
                                              user_defined_fields: UserDefinedFields::UserDefinedFieldsSerializer
                                            ]]
  end
end