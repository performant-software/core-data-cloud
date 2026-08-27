module CoreDataConnector
  module Public
    module V1
      class PublicSerializer < BaseSerializer

        def render_index(items)
          return super unless options[:target].present?

          serialized_items = super
          return serialized_items unless options[:target].present?

          serialized = []
          target = resolve_target

          serialized_items.each_with_index do |item, index|
            serialized << {
              type: 'Annotation',
              id: index,
              created: DateTime.now.to_s,
              motivation: 'linking',
              target: target,
              body: item
            }
          end

          {
            '@context': 'http://www.w3.org/ns/anno.jsonld',
            id: options[:url],
            type: 'AnnotationPage',
            partOf: {
              id: options[:url],
              label: I18n.t(
                'serialization.linked_open_data.annotation_page_label',
                klass: items.klass.to_s.demodulize.pluralize,
                target: target[:name]
              ),
              total: options[:count],
              page: options[:page],
              pages: options[:pages]
            },
            items: serialized
          }
        end

        def render_show(item)
          serialized = super
          serialized[:id] = options[:url]

          serialized
        end

        private

        def resolve_target
          item = options[:target]
          return {} if item.nil?

          serializer_class = "CoreDataConnector::Public::V1::#{item.class.to_s.demodulize.pluralize}Serializer".constantize
          serializer = serializer_class.new(current_user)

          serializer.render_index(item)&.first
        end
      end
    end
  end
end