# This migration comes from core_data_connector (originally 20250603154715)
class AddArchivedToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_projects, :archived, :boolean, default: false, null: false
  end
end
