# This migration comes from core_data_connector (originally 20240122175227)
class CreateCoreDataConnectorPlaceLayers < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_place_layers do |t|
      t.references :place
      t.string :name
      t.string :layer_type
      t.string :url
      t.string :geometry
      t.timestamps
    end
  end
end
