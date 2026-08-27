module CoreDataConnector
  module Mergeable
    extend ActiveSupport::Concern

    included do
      has_many :record_merges, as: :mergeable, dependent: :destroy
    end
  end
end