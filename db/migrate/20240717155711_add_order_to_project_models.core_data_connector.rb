# This migration comes from core_data_connector (originally 20240717155011)
class AddOrderToProjectModels < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_project_models, :order, :integer, default: 0, null: false
  end
end
