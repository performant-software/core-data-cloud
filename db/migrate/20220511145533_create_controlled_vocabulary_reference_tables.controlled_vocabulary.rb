# This migration comes from controlled_vocabulary (originally 20220511141717)
class CreateControlledVocabularyReferenceTables < ActiveRecord::Migration[7.0]
  def up
    create_table :controlled_vocabulary_reference_tables do |t|
      t.string :name
      t.string :key

      t.timestamps
    end
  end

  def down
    drop_table :controlled_vocabulary_reference_tables
  end
end
