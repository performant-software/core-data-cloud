# This migration comes from core_data_connector (originally 20230912141451)
class CreateCoreDataConnectorProjectModels < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_project_models do |t|
      t.references :project
      t.string :name
      t.string :model_class
      t.timestamps
    end
  end
end
