# This migration comes from core_data_connector (originally 20240118162447)
class AddExtraToCoreDataConnectorWebIdentifiers < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_web_identifiers, :extra, :jsonb
  end
end
