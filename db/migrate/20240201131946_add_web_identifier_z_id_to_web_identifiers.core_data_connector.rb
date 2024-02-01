# This migration comes from core_data_connector (originally 20240122201553)
class AddWebIdentifierZIdToWebIdentifiers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_web_identifiers, :z_web_identifier_id, :integer
  end
end