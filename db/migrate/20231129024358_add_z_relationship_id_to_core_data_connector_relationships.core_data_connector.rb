# This migration comes from core_data_connector (originally 20231128164059)
class AddZRelationshipIdToCoreDataConnectorRelationships < ActiveRecord::Migration[7.0]
  def change
    add_column :core_data_connector_relationships, :z_relationship_id, :integer
  end
end
