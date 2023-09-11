# This migration comes from core_data_connector (originally 20230822143805)
class CreateCoreDataConnectorUserProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_user_projects do |t|
      t.references :user, null: false, index: true
      t.references :project, null: false, index: true
      t.string :role, null: false

      t.timestamps
    end
  end
end
