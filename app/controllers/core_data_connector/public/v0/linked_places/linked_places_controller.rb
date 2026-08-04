module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class LinkedPlacesController < PublicController

          protected

          def build_index_response(items, metadata)
            options = load_records(items).merge({ count: metadata[:count], page: metadata[:page], pages: metadata[:pages] })
            serializer = serializer_class.new(current_user, options)

            # For nested resources, we'll render the annotation attributes. Otherwise, we'll render the index attributes.
            if nested_resource?
              serializer.render_annotation(items)
            else
              serializer.render_index(items)
            end
          end

          def build_show_response(item)
            options = load_records(item)
            serializer = serializer_class.new(current_user, options)
            serializer.render_show(item)
          end

          # Sets the additional attributes that are needed in the serializer
          def load_records(items)
            opts = super

            opts.merge({
                         target: current_record,
                         url: request.url
                       })
          end

          def serializer_class
            "CoreDataConnector::Public::V0::LinkedPlaces::#{"#{controller_name}_serializer".classify}".constantize
          end
        end
      end
    end
  end
end