# This migration comes from core_data_connector (originally 20240904200604)
class RemoveSourceTitlesAndNames < ActiveRecord::Migration[7.0]
  def change
    drop_table :core_data_connector_source_titles
    drop_table :core_data_connector_names
  end
end
