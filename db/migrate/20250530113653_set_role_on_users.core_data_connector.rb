# This migration comes from core_data_connector (originally 20250529183706)
class SetRoleOnUsers < ActiveRecord::Migration[7.0]
  def change
    execute <<-SQL.squish
      UPDATE core_data_connector_users users
         SET role = 'member'
       WHERE EXISTS ( SELECT 1
                        FROM core_data_connector_user_projects user_projects
                       WHERE user_projects.user_id = users.id
                         AND user_projects.role = 'owner' )
    SQL

    execute <<-SQL.squish
      UPDATE core_data_connector_users users
         SET role = 'guest'
       WHERE NOT EXISTS ( SELECT 1
                            FROM core_data_connector_user_projects user_projects
                           WHERE user_projects.user_id = users.id
                             AND user_projects.role = 'owner' )
    SQL

    execute <<-SQL.squish
      UPDATE core_data_connector_users
         SET role = 'admin'
       WHERE admin IS TRUE
    SQL
  end
end
