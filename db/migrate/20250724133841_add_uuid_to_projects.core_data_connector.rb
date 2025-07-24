# This migration comes from core_data_connector (originally 20250724125222)
class AddUuidToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_projects, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
