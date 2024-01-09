# This migration comes from core_data_connector (originally 20240108194908)
class AddZSourceFieldsToNames < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_names, :z_source_id, :integer
    add_column :core_data_connector_names, :z_source_type, :string
  end
end
