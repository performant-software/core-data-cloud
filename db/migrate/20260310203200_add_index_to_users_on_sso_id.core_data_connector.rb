# This migration comes from core_data_connector (originally 20260310203024)
class AddIndexToUsersOnSsoId < ActiveRecord::Migration[8.0]
  def change
    add_index :core_data_connector_users, :sso_id, unique: true
  end
end
