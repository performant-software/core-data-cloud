# This migration comes from core_data_connector (originally 20250602115106)
class SetDefaultRoleOnUserProjects < ActiveRecord::Migration[7.0]
  def change
    change_column_default :core_data_connector_user_projects, :role, 'editor'
    change_column_null :core_data_connector_user_projects, :role, false
  end
end
