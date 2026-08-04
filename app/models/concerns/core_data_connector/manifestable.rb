module CoreDataConnector
  module Manifestable
    extend ActiveSupport::Concern

    included do
      has_many :manifests, as: :manifestable, class_name: Manifest.to_s, dependent: :destroy
    end
  end
end