# This migration comes from core_data_connector (originally 20230911104959)
class CreateCoreDataConnectorProjectItems < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_project_items do |t|
      t.references :project
      t.references :ownable, polymorphic: true
      t.timestamps
    end
  end
end
