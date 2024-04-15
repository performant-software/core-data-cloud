# This migration comes from triple_eye_effable (originally 20220728122619)
class CreateTripleEyeEffableResourceDescription < ActiveRecord::Migration[6.0]
  def up
    create_table :triple_eye_effable_resource_descriptions do |t|
      t.references :resourceable, polymorphic: true, null: false, index: { name: 'index_resource_description_on_resourceable' }
      t.string :resource_id
      t.timestamps
    end
  end

  def down
    drop_table :triple_eye_effable_resource_descriptions
  end
end
