# This migration comes from core_data_connector (originally 20230914103515)
class AddSlugToProjectModelRelationships < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_project_model_relationships, :slug, :string
  end
end
