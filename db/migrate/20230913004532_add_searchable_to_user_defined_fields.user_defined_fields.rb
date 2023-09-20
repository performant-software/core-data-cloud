# This migration comes from user_defined_fields (originally 20220923171613)
class AddSearchableToUserDefinedFields < ActiveRecord::Migration[7.0]
  def up
    add_column :user_defined_fields_user_defined_fields, :searchable, :boolean, null: false, default: false
  end

  def down
    remove_columm :user_defined_fields_user_defined_fields, :searchable
  end
end
