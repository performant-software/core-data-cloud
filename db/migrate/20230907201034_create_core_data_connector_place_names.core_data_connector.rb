# This migration comes from core_data_connector (originally 20230810191546)
class CreateCoreDataConnectorPlaceNames < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_place_names do |t|
      t.references :place, null: false, index: true
      t.string :name
      t.boolean :primary

      t.timestamps
    end
  end
end
