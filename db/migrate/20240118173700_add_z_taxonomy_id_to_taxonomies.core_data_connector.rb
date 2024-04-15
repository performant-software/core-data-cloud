# This migration comes from core_data_connector (originally 20240117215342)
class AddZTaxonomyIdToTaxonomies < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_taxonomies, :z_taxonomy_id, :integer
  end
end
