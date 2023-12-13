# This migration comes from core_data_connector (originally 20231207211630)
class AddUuidToTaxonomies < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_taxonomies, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
