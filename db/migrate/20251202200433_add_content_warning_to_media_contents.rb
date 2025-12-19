class AddContentWarningToMediaContents < ActiveRecord::Migration[8.0]
  def change
    add_column :core_data_connector_media_contents, :content_warning, :boolean, default: false, null: false
  end
end
