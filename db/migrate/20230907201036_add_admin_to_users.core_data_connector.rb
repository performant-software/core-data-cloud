# This migration comes from core_data_connector (originally 20230822111817)
class AddAdminToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_users, :admin, :boolean, default: false
  end
end
