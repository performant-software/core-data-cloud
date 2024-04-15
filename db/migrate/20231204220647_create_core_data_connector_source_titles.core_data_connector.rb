# This migration comes from core_data_connector (originally 20231129192431)
class CreateCoreDataConnectorSourceTitles < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_source_titles do |t|
      t.references :nameable, polymorphic: true
      t.references :name
      t.boolean :primary

      t.timestamps
    end
  end
end
