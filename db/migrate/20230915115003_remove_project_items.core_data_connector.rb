# This migration comes from core_data_connector (originally 20230915113442)
class RemoveProjectItems < ActiveRecord::Migration[7.0]
  def change
    drop_table :core_data_connector_project_items
  end
end
