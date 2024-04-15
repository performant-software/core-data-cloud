# This migration comes from core_data_connector (originally 20230810190910)
class CreateCoreDataConnectorPlaces < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_places do |t|
      t.string :uid

      t.timestamps
    end
  end
end
