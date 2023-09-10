# This migration comes from core_data_connector (originally 20220504204218)
class CreateCoreDataConnectorUsers < ActiveRecord::Migration[7.0]
  def up
    create_table :core_data_connector_users do |t|
      t.string :name
      t.string :email
      t.string :password_digest

      t.timestamps
    end
  end

  def down
    drop_table :users
  end
end
