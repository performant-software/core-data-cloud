module CoreDataConnector
  module Identifiable
    extend ActiveSupport::Concern

    included do
      has_many :web_identifiers, as: :identifiable, class_name: WebIdentifier.to_s, dependent: :destroy
    end
  end
end