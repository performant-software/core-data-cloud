# This migration comes from core_data_connector (originally 20250724135202)
class UpdateProjectsUseStorageKeyDefault < ActiveRecord::Migration[8.0]
  def change
    change_column_default :core_data_connector_projects, :use_storage_key, from: false, to: true
  end
end
