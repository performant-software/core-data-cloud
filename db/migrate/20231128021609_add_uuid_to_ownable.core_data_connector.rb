# This migration comes from core_data_connector (originally 20231128015930)
class AddUuidToOwnable < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_media_contents, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :core_data_connector_organizations, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :core_data_connector_people, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :core_data_connector_places, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
