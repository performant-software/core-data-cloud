# This migration comes from core_data_connector (originally 20240529143512)
class AddUuidToRelationships < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_relationships, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
