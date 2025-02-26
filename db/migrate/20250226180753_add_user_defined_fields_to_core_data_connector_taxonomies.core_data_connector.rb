# This migration comes from core_data_connector (originally 20250226175155)
class AddUserDefinedFieldsToCoreDataConnectorTaxonomies < ActiveRecord::Migration[7.0]
  def up
    add_column :core_data_connector_taxonomies, :user_defined, :jsonb, default: {}
    add_index :core_data_connector_taxonomies, :user_defined, using: :gin
  end

  def down
    remove_index :core_data_connector_taxonomies, :user_defined
    remove_column :core_data_connector_taxonomies, :user_defined
  end
end
