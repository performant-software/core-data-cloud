module CoreDataConnector
  module DisplayNameable
    extend ActiveSupport::Concern

    def display_name
      name_from_nameable.presence ||
        name_from_attributes.presence
    end

    private

    def name_from_nameable
      return unless self.class.respond_to?(:get_names_table)
      return if self.class.get_names_table.blank?

      primary_name&.name.presence
    end

    def name_from_attributes
      return self[:name].to_s if self[:name].present?

      nil
    end
  end
end