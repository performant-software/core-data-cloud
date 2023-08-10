# This migration comes from controlled_vocabulary (originally 20220511141749)
class CreateControlledVocabularyReferenceCodes < ActiveRecord::Migration[7.0]
  def up
    create_table :controlled_vocabulary_reference_codes do |t|
      t.references :reference_table, index: { name: 'index_reference_codes_on_reference_table_id' }
      t.string :name

      t.timestamps
    end
  end

  def down
    drop_table :controlled_vocabulary_reference_codes
  end
end
