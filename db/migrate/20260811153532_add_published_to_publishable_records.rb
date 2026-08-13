class AddPublishedToPublishableRecords < ActiveRecord::Migration[8.1]
  TABLES = [
    :core_data_connector_events,
    :core_data_connector_instances,
    :core_data_connector_items,
    :core_data_connector_media_contents,
    :core_data_connector_organizations,
    :core_data_connector_people,
    :core_data_connector_places,
    :core_data_connector_taxonomies,
    :core_data_connector_works
  ]

  def change
    TABLES.each do |table|
      add_column table, :published, :boolean, default: true, null: false
    end
  end
end
