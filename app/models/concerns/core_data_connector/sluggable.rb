module CoreDataConnector
  module Sluggable
    extend ActiveSupport::Concern

    included do
      # Callbacks
      before_validation :set_slug, on: :create

      # Validations
      validates :slug, presence: true

      private

      def set_slug
        return unless new_record? || name_changed?

        self.slug = name.parameterize(separator: '_')
      end
    end
  end
end