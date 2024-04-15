# This migration comes from core_data_connector (originally 20231110152017)
class AddZPlaceIdToCoreDataConnectorPlaces < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_places, :z_place_id, :integer
  end
end
