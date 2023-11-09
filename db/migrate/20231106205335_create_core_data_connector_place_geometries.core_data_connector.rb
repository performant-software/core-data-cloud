# This migration comes from core_data_connector (originally 20231106204031)
class CreateCoreDataConnectorPlaceGeometries < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_place_geometries do |t|
      t.references :place, null: false, index: true
      t.geometry :geometry
      t.timestamps
    end
  end
end
