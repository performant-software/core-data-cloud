# This migration comes from user_defined_fields (originally 20230920110728)
class AddUuidToUserDefinedFields < ActiveRecord::Migration[7.0]
  def change
    add_column :user_defined_fields_user_defined_fields, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
