# This migration comes from core_data_connector (originally 20240927191700)
class AddImportIdToModels < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_events, :import_id, :uuid, index: true
    add_column :core_data_connector_instances, :import_id, :uuid, index: true
    add_column :core_data_connector_items, :import_id, :uuid, index: true
    add_column :core_data_connector_organizations, :import_id, :uuid, index: true
    add_column :core_data_connector_people, :import_id, :uuid, index: true
    add_column :core_data_connector_places, :import_id, :uuid, index: true
    add_column :core_data_connector_relationships, :import_id, :uuid, index: true
    add_column :core_data_connector_taxonomies, :import_id, :uuid, index: true
    add_column :core_data_connector_works, :import_id, :uuid, index: true
  end
end
