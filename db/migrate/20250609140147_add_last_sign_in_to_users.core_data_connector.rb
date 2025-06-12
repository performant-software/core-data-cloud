# This migration comes from core_data_connector (originally 20250609135907)
class AddLastSignInToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_users, :last_sign_in_at, :timestamp
  end
end
