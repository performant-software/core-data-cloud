module CoreDataConnector
  class FactorySerializer < BaseSerializer

    def render_index(item)
      serializer = resolve_serializer(item)
      serializer.render_index(item) unless serializer.nil?
    end

    def render_show(item)
      serializer = resolve_serializer(item)
      serializer.render_show(item) unless serializer.nil?
    end

    private

    def resolve_serializer(item)
      serializer_class = "#{item.class.name.pluralize}Serializer".safe_constantize
      serializer_class.new(current_user)
    end
  end
end