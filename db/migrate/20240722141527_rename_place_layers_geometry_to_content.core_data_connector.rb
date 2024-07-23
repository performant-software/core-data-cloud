# This migration comes from core_data_connector (originally 20240722113555)
class RenamePlaceLayersGeometryToContent < ActiveRecord::Migration[7.0]
  def change
    rename_column :core_data_connector_place_layers, :geometry, :content
  end
end
