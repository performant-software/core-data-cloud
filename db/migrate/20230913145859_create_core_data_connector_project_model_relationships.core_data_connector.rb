# This migration comes from core_data_connector (originally 20230913144049)
class CreateCoreDataConnectorProjectModelRelationships < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_project_model_relationships do |t|
      t.references :primary_model, null: false, index: { name: 'index_cdc_project_model_relationships_on_primary_model_id' }
      t.references :related_model, null: false, index: { name: 'index_cdc_project_model_relationships_on_related_model_id' }
      t.string :name
      t.boolean :multiple
      t.timestamps
    end
  end
end
