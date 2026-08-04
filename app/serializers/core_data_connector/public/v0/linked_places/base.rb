module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class Base < BaseSerializer
          DEFAULT_CONTEXT = 'https://raw.githubusercontent.com/LinkedPasts/linked-places/master/linkedplaces-context-v1.1.jsonld'

          def self.annotation_attributes(*attrs, &block)
            @annotation_attributes ||= []

            if attrs.present?
              if attrs.size == 1 && block.present?
                @annotation_attributes << { attrs[0] => block }
              else
                @annotation_attributes += attrs
              end
            end

            @annotation_attributes
          end

          def self.base_url
            "#{ENV['HOSTNAME']}/core_data/public"
          end

          def self.target_attributes(*attrs, &block)
            @target_attributes ||= []

            if attrs.present?
              if attrs.size == 1 && block.present?
                @target_attributes << { attrs[0] => block }
              else
                @target_attributes += attrs
              end
            end

            @target_attributes
          end

          def render_index(items)
            return [] if items.nil?

            serialized = []

            [items].flatten.each do |item|
              item_serialized = {}

              self.class.index_attributes.each do |a|
                extract_value item_serialized, item, a
              end

              serialized << item_serialized
            end

            {
              type: 'FeatureCollection',
              '@context': DEFAULT_CONTEXT,
              metadata: {
                count: options[:count],
                page: options[:page],
                pages: options[:pages]
              },
              features: serialized
            }
          end

          def render_annotation(items)
            return [] if items.nil?

            serialized = []
            target = resolve_target

            [items].flatten.each_with_index do |item, index|
              item_serialized = {}

              self.class.annotation_attributes.each do |a|
                extract_value item_serialized, item, a
              end

              serialized << {
                type: 'Annotation',
                id: index,
                created: DateTime.now.to_s,
                motivation: 'linking',
                target: target,
                body: item_serialized
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
                total: options[:count]
              },
              items: serialized
            }
          end

          def render_target(item)
            return {} if item.nil?

            serialized = {}

            # Set all of the base attributes
            self.class.target_attributes&.each do |a|
              extract_value serialized, item, a
            end

            serialized
          end

          private

          def resolve_target
            item = options[:target]
            return {} if item.nil?

            serializer_class = "CoreDataConnector::Public::V0::LinkedPlaces::#{item.class.to_s.demodulize.pluralize}Serializer".constantize
            serializer = serializer_class.new(current_user)

            serializer.render_target(item)
          end
        end
      end
    end
  end
end