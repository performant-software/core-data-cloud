# This migration comes from core_data_connector (originally 20231128015907)
class RemoveCoreDataConnectorLocations < ActiveRecord::Migration[7.0]
  def change
    drop_table :core_data_connector_locations
  end
end
