# This migration comes from core_data_connector (originally 20240112191132)
class CreateCoreDataConnectorWebAuthorities < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_web_authorities do |t|
      t.references :project
      t.string :source_type
      t.jsonb :access
      t.timestamps
    end
  end
end
