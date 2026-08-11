module CoreDataConnector
  module Publishable
    extend ActiveSupport::Concern

    included do
      # Scopes
      scope :published, -> { where(published: true) }
      scope :unpublished, -> { where(published: false) }
    end

    def publish!
      update!(published: true)
    end

    def unpublish!
      update!(published: false)
    end
  end
end
