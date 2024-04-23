# This migration comes from core_data_connector (originally 20240416153109)
class CreateCoreDataConnectorEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_events do |t|
      t.references :project_model
      t.uuid :uuid, default: 'gen_random_uuid()', null: false
      t.string :name
      t.text :description
      t.integer :z_event_id
      t.timestamps
    end
  end
end
