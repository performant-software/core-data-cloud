# This migration comes from core_data_connector (originally 20240108143938)
class AddZItemIdToCoreDataConnectorItems < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_items, :z_item_id, :integer
  end
end
