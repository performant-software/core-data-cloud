# This migration comes from user_defined_fields (originally 20221025201735)
class AddOrderToUserDefinedFields < ActiveRecord::Migration[7.0]
  def up
    add_column :user_defined_fields_user_defined_fields, :order, :integer, null: false, default: 0
  end

  def down
    remove_column :user_defined_fields_user_defined_fields, :order
  end
end
