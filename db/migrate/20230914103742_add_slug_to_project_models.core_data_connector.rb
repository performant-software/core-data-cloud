# This migration comes from core_data_connector (originally 20230914103504)
class AddSlugToProjectModels < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_project_models, :slug, :string
  end
end
