# This migration comes from core_data_connector (originally 20260514201613)
class AddMergedNameToRecordMerges < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_record_merges, :merged_name, :string
  end
end
