# This migration comes from controlled_vocabulary (originally 20220511143343)
class CreateControlledVocabularyReferences < ActiveRecord::Migration[7.0]
  def up
    create_table :controlled_vocabulary_references do |t|
      t.references :reference_code, null: false, index: { name: 'index_references_on_reference_code_id' }
      t.references :referrable, polymorphic: true, null: false, index: { name: 'index_references_on_referrable' }
      t.string :key

      t.timestamps
    end
  end

  def down
    drop_table :controlled_vocabulary_references
  end
end
