# This migration comes from core_data_connector (originally 20240904200510)
class MigrateSourceTitlesToSourceNames < ActiveRecord::Migration[7.0]
  def change
    execute <<-SQL.squish
      INSERT INTO core_data_connector_source_names ( nameable_id, nameable_type, name, created_at, updated_at )
      SELECT source_titles.name_id, source_titles.nameable_type, names.name, source_titles.created_at, source_titles.updated_at
        FROM core_data_connector_source_titles source_titles
        JOIN core_data_connector_names names ON names.id = source_titles.name_id
    SQL

    execute <<-SQL.suqish
      DELETE
        FROM core_data_connector_source_names
       WHERE nameable_type = 'CoreDataConnector::Instance'
         AND nameable_id NOT IN ( SELECT id 
                                    FROM core_data_connector_instances )
    SQL

    execute <<-SQL.suqish
      DELETE
        FROM core_data_connector_source_names
       WHERE nameable_type = 'CoreDataConnector::Item'
         AND nameable_id NOT IN ( SELECT id 
                                    FROM core_data_connector_items )
    SQL

    execute <<-SQL.suqish
      DELETE
        FROM core_data_connector_source_names
       WHERE nameable_type = 'CoreDataConnector::Work'
         AND nameable_id NOT IN ( SELECT id 
                                    FROM core_data_connector_works )  
    SQL
  end
end
