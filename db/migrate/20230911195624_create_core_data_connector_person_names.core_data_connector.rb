# This migration comes from core_data_connector (originally 20230911160412)
class CreateCoreDataConnectorPersonNames < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_person_names do |t|
      t.references :person
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.boolean :primary

      t.timestamps
    end
  end
end
