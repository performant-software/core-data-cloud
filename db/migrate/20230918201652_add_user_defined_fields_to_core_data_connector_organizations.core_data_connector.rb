# This migration comes from core_data_connector (originally 20230918201537)
class AddUserDefinedFieldsToCoreDataConnectorOrganizations < ActiveRecord::Migration[7.0]
  def up
    add_column :core_data_connector_organizations, :user_defined, :jsonb, default: {}
    add_index :core_data_connector_organizations, :user_defined, using: :gin
  end

  def down
    remove_index :core_data_connector_organizations, :user_defined
    remove_column :core_data_connector_organizations, :user_defined
  end
end
