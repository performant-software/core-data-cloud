# This migration comes from core_data_connector (originally 20240212175452)
class CreateCoreDataConnectorManifests < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_manifests do |t|
      t.references :manifestable, polymorphic: true
      t.references :project_model_relationship, null: false, index: { name: 'index_cdc_manifests_on_project_model_relationship_id' }
      t.string :identifier
      t.string :label
      t.string :thumbnail
      t.text :content
      t.timestamps
    end
  end
end
