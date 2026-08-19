module CoreDataConnector
  module Publishable
    extend ActiveSupport::Concern

    included do
      # Scopes
      scope :published, -> { where(published: true) }
      scope :unpublished, -> { where(published: false) }

      # Callbacks
      before_validation :set_published, on: :create

      private

      def set_published
        self[:published] = project.default_to_published
      end
    end

    def update_published(value)
      self[:published] = value
      save(validate: false)
    end
  end
end
