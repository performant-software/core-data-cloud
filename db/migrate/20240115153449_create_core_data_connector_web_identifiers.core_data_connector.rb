# This migration comes from core_data_connector (originally 20240112191137)
class CreateCoreDataConnectorWebIdentifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_web_identifiers do |t|
      t.references :web_authority
      t.references :identifiable, polymorphic: true
      t.string :identifier
      t.timestamps
    end
  end
end
