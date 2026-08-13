class AddDefaultToPublishedToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :core_data_connector_projects, :default_to_published, :boolean, default: true, null: false
  end
end
