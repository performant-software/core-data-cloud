# This migration comes from core_data_connector (originally 20231115163846)
class CreateCoreDataConnectorItems < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_items do |t|
      t.references :project_model
      t.uuid :uuid, default: 'gen_random_uuid()', null: false

      t.timestamps
    end
  end
end
