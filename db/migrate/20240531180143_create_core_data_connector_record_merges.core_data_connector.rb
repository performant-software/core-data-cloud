# This migration comes from core_data_connector (originally 20240531174613)
class CreateCoreDataConnectorRecordMerges < ActiveRecord::Migration[7.0]
  def change
    create_table :core_data_connector_record_merges do |t|
      t.references :mergeable, polymorphic: true
      t.string :merged_uuid
      t.timestamps
    end
  end
end
