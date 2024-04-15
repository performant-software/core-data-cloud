# This migration comes from user_defined_fields (originally 20220916120853)
class CreateUserDefinedFieldsUserDefinedFields < ActiveRecord::Migration[6.0]
  def up
    create_table :user_defined_fields_user_defined_fields do |t|
      t.references :defineable, polymorphic: true, null: true, index: { name: 'index_user_defined_fields_on_defineable' }
      t.string :table_name
      t.string :column_name
      t.string :data_type
      t.boolean :required
      t.boolean :allow_multiple
      t.text :options, array: true, default: []

      t.timestamps
    end
  end

  def down
    drop_table :user_defined_fields_user_defined_fields
  end
end
