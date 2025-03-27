# This migration comes from core_data_connector (originally 20250204210235)
class AddMapLibraryUrlToCoreDataConnectorProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_projects, :map_library_url, :string
  end
end
