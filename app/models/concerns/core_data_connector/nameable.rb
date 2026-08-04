module CoreDataConnector
  module Nameable
    extend ActiveSupport::Concern

    class_methods do
      def name_table(name, options = {})
        # Relationships
        if options && options[:as]
          self.send(:has_many, name.to_sym, dependent: :destroy, as: options[:as])
          has_one :primary_name, -> { where(primary: true) }, class_name: name.to_s.classify, as: options[:as]
          has_many :ordered_names, -> { order(primary: :desc) }, class_name: name.to_s.classify, as: options[:as]
        else
          self.send(:has_many, name.to_sym, dependent: :destroy)
          has_one :primary_name, -> { where(primary: true) }, class_name: name.to_s.classify
          has_many :ordered_names, -> { order(primary: :desc) }, class_name: name.to_s.classify
        end

        # Nested attributes
        self.send(:accepts_nested_attributes_for, name.to_sym, allow_destroy: true)

        @names_table = name
        @nameable_attribute = options[:as] if options && options[:as]
      end

      def get_names_table
        @names_table
      end

      def name_column(table_alias = nil)
        if table_alias
          return "#{table_alias}.name"
        end

        "name"
      end

      def nameable_attribute
        @nameable_attribute
      end
    end

    included do
      # Validations
      validate :validate_names

      private

      def has_primary_name?
        names = self.send(self.class.get_names_table)
        names.select{ |n| n.primary? }.present?
      end

      def validate_names
        errors.add(:names, I18n.t('errors.nameable.primary_name')) unless has_primary_name?
      end
    end
  end
end