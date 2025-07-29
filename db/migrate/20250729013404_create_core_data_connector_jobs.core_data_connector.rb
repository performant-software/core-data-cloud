# This migration comes from core_data_connector (originally 20250725104315)
class CreateCoreDataConnectorJobs < ActiveRecord::Migration[8.0]
  def change
    create_table :core_data_connector_jobs do |t|
      t.references :project, null: false
      t.references :user, null: false
      t.string :job_type
      t.string :status, default: 'initializing'
      t.jsonb :extra, default: {}
      t.timestamps
    end
  end
end
