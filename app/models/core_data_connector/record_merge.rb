module CoreDataConnector
  class RecordMerge < ApplicationRecord
    belongs_to :mergeable, polymorphic: true
  end
end