class CreateProjectItems < ActiveRecord::Migration[7.0]
  def change
    create_table :project_items do |t|
      t.references :project, null: false, foreign_key: true
      t.references :projectable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
