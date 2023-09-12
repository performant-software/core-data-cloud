# This migration comes from core_data_connector (originally 20230912105050)
class CreateCoreDataConnectorOrganizationNames < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_organization_names do |t|
      t.references :organization
      t.string :name
      t.boolean :primary
      t.timestamps
    end
  end
end
