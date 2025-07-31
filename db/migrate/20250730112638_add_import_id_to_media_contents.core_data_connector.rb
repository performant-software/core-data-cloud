# This migration comes from core_data_connector (originally 20250730112348)
class AddImportIdToMediaContents < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_media_contents, :import_id, :uuid
  end
end
