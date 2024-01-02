# This migration comes from core_data_connector (originally 20231208205056)
class AddUserDefinedFieldsToCoreDataConnectorWorks < ActiveRecord::Migration[7.0]
  def up
    add_column :core_data_connector_works, :user_defined, :jsonb, default: {}
    add_index :core_data_connector_works, :user_defined, using: :gin
  end

  def down
    remove_index :core_data_connector_works, :user_defined
    remove_column :core_data_connector_works, :user_defined
  end
end
