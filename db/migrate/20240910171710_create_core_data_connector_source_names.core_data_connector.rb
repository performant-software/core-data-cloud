# This migration comes from core_data_connector (originally 20240904200002)
class CreateCoreDataConnectorSourceNames < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_source_names do |t|
      t.references :nameable, polymorphic: true
      t.string :name
      t.boolean :primary, null: false, default: false
      t.timestamps
    end
  end
end
