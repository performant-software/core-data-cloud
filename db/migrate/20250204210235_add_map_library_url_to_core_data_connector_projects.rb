class AddMapLibraryUrlToCoreDataConnectorProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_projects, :map_library_url, :string
  end
end
