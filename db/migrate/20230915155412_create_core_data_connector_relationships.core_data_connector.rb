# This migration comes from core_data_connector (originally 20230915150731)
class CreateCoreDataConnectorRelationships < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_relationships do |t|
      t.references :project_model_relationship, index: { name: 'index_cdc_relationships_on_project_model_relationship_id' }
      t.references :primary_record, polymorphic: true
      t.references :related_record, polymorphic: true
      t.timestamps
    end
  end
end
