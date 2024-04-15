# This migration comes from core_data_connector (originally 20231030105236)
class AddDiscoverableToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_projects, :discoverable, :boolean, null: false, default: false
  end
end
