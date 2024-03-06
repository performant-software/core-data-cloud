# This migration comes from core_data_connector (originally 20240305174127)
class AddItemCountToManifests < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_manifests, :item_count, :integer, null: false, default: 0
  end
end
