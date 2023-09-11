# This migration comes from core_data_connector (originally 20230810201204)
class CreateCoreDataConnectorLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_locations do |t|
      t.references :place, null: false, index: true
      t.references :locateable, polymorphic: true, null: false, index: true

      t.timestamps
    end
  end
end
