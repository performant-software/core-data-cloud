# This migration comes from core_data_connector (originally 20230926143625)
class CreateCoreDataConnectorMediaContents < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_media_contents do |t|
      t.references :project_model
      t.string :name
      t.timestamps
    end
  end
end
