# This migration comes from core_data_connector (originally 20240108143947)
class AddZWorkIdToCoreDataConnectorWorks < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_works, :z_work_id, :integer
  end
end
