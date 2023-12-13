# This migration comes from core_data_connector (originally 20231117204701)
class CreateCoreDataConnectorTaxonomies < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_taxonomies do |t|
      t.references :project_model
      t.string :name

      t.timestamps
    end
  end
end
