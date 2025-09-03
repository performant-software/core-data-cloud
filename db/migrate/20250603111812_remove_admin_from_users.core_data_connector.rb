# This migration comes from core_data_connector (originally 20250603111744)
class RemoveAdminFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :core_data_connector_users, :admin
  end
end
