# This migration comes from core_data_connector (originally 20231106203938)
class EnablePostgisExtension < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'postgis'
  end
end
