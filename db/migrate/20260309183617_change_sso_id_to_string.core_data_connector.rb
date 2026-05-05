# This migration comes from core_data_connector (originally 20260309183501)
class ChangeSsoIdToString < ActiveRecord::Migration[8.0]
  def change
    change_column :core_data_connector_users, :sso_id, :string
  end
end
