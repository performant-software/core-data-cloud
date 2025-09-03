# This migration comes from core_data_connector (originally 20250606134315)
class AddRequirePasswordChangeToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_users, :require_password_change, :boolean, default: false, null: false
  end
end
