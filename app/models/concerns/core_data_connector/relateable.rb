module CoreDataConnector
  module Relateable
    extend ActiveSupport::Concern

    included do
      has_many :relationships, as: :primary_record, dependent: :destroy
      has_many :related_relationships, as: :related_record, dependent: :destroy, class_name: Relationship.to_s
    end
  end
end