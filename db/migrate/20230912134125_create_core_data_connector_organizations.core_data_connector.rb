# This migration comes from core_data_connector (originally 20230912105038)
class CreateCoreDataConnectorOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_organizations do |t|
      t.text :description
      t.timestamps
    end
  end
end
