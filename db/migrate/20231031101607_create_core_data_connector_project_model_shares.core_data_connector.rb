# This migration comes from core_data_connector (originally 20231030182359)
class CreateCoreDataConnectorProjectModelShares < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_project_model_shares do |t|
      t.references :project_model_access, index: { name: 'index_cdc_project_model_shares_on_project_model_access_id' }
      t.references :project_model, index: { name: 'index_cdc_project_model_shares_on_project_model_id' }
      t.timestamps
    end
  end
end
