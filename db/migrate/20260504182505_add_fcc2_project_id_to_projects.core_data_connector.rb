# This migration comes from core_data_connector (originally 20260416013801)
class AddFcc2ProjectIdToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_projects, :faircopy_cloud_project_id, :integer
  end
end
