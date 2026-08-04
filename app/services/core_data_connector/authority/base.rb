module CoreDataConnector
  module Authority
    class Base

      def self.create_service(authority)
        class_name = "CoreDataConnector::Authority::#{authority.source_type.capitalize}"
        klass = class_name.constantize
        klass.new
      end

      def before_create(web_identifier)
        # Implemented in sub-classes
      end

      def find(id, options = {})
        # Implemented in sub-classes
      end

      def search(query, options = {})
        # Implemented in sub-classes
      end

    end
  end
end