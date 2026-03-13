# This migration comes from core_data_connector (originally 20260311205249)
class AddSsoInvitationIdToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_users, :sso_invitation_id, :string
  end
end
