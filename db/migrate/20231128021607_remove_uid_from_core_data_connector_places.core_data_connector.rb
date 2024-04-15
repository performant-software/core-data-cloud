# This migration comes from core_data_connector (originally 20231128015828)
class RemoveUidFromCoreDataConnectorPlaces < ActiveRecord::Migration[7.0]
  def change
    remove_column :core_data_connector_places, :uid
  end
end
