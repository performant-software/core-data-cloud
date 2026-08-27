module CoreDataConnector
  module Export
    module Nameable
      extend ActiveSupport::Concern

      NAME_DELIMITER = ';'

      included do

        def format_name(attr = :name)
          ordered_names.map(&attr).join(NAME_DELIMITER)
        end

      end
    end
  end
end