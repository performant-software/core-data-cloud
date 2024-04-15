# This migration comes from core_data_connector (originally 20231127192733)
class AddZOrganizationIdToCoreDataConnectorOrganizations < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_organizations, :z_organization_id, :integer
  end
end
