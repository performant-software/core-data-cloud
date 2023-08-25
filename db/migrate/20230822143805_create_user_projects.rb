class CreateUserProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :user_projects do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.string :role, null: false

      t.timestamps
    end
  end
end
