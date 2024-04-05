# This migration comes from core_data_connector (originally 20240326175454)
class AddFccFieldsToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_projects, :faircopy_cloud_url, :string
    add_column :core_data_connector_projects, :faircopy_cloud_project_model_id, :integer
  end
end
