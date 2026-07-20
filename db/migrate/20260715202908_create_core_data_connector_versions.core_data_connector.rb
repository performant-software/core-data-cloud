# This migration comes from core_data_connector (originally 20260715000000)
class CreateCoreDataConnectorVersions < ActiveRecord::Migration[8.1]
  def change
    create_table :core_data_connector_versions do |t|
      t.string :item_type, null: false
      t.bigint :item_id, null: false
      t.string :event, null: false
      t.string :whodunnit
      t.jsonb :object
      t.jsonb :object_changes
      t.string :root_type
      t.bigint :root_id
      t.jsonb :meta
      t.string :request_uuid
      t.datetime :created_at
    end

    add_index :core_data_connector_versions, [:item_type, :item_id]
    add_index :core_data_connector_versions, [:root_type, :root_id]
    add_index :core_data_connector_versions, :request_uuid
    add_index :core_data_connector_versions, :whodunnit
  end
end
