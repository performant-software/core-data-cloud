# This migration comes from core_data_connector (originally 20231022110706)
class AddInverseFieldsToProjectModelRelationships < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_project_model_relationships, :allow_inverse, :boolean, null: false, default: false
    add_column :core_data_connector_project_model_relationships, :inverse_name, :string
    add_column :core_data_connector_project_model_relationships, :inverse_multiple, :boolean, null: :false, default: false
  end
end
