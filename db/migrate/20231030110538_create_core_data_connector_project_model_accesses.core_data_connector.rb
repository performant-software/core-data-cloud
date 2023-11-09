# This migration comes from core_data_connector (originally 20231030105439)
class CreateCoreDataConnectorProjectModelAccesses < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_project_model_accesses do |t|
      t.references :project_model, index: { name: 'index_cdc_project_model_accesses_on_project_model_id' }
      t.references :project, index: { name: 'index_cdc_project_model_accesses_on_project_id' }
      t.timestamps
    end
  end
end
