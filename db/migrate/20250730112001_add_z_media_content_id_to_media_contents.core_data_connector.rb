# This migration comes from core_data_connector (originally 20250729174026)
class AddZMediaContentIdToMediaContents < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_media_contents, :z_media_content_id, :integer
  end
end
