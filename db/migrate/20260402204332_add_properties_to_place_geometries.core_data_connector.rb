# This migration comes from core_data_connector (originally 20260402204230)
class AddPropertiesToPlaceGeometries < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_place_geometries, :properties, :jsonb, default: {}
  end
end
