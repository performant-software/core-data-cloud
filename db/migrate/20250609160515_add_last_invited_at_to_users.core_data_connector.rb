# This migration comes from core_data_connector (originally 20250609155308)
class AddLastInvitedAtToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_users, :last_invited_at, :timestamp
  end
end
