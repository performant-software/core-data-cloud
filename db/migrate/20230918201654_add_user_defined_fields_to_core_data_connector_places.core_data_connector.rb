# This migration comes from core_data_connector (originally 20230918201552)
class AddUserDefinedFieldsToCoreDataConnectorPlaces < ActiveRecord::Migration[7.0]
  def up
    add_column :core_data_connector_places, :user_defined, :jsonb, default: {}
    add_index :core_data_connector_places, :user_defined, using: :gin
  end

  def down
    remove_index :core_data_connector_places, :user_defined
    remove_column :core_data_connector_places, :user_defined
  end
end
