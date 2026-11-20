module CoreDataConnector
  module Public
    module V1
      class PublicController < ApplicationController
        # Includes
        include NestableController
        include UnauthorizeableController

        protected

        def base_query
          return item_class.none unless params[:project_ids].present?

          return related_records_query.call if nested_resource? && current_record.present?

          query = super

          query = if nested_resource?
                    item_class.none
                  elsif params[:id].present?
                    query.where(uuid: params[:id])
                  elsif params[:project_ids].present?
                    query.merge(item_class.all_records_by_project(params[:project_ids]))
                  else
                    item_class.none
                  end

          query.published
        end

        def find_record(query)
          query.find_by!(uuid: params[:id])
        end

        def policy_class
          CoreDataConnector::Public::V1::PublicPolicy
        end

        # Preloads the relationships records scoped to the passed project_ids
        def preloads(query)
          super

          return unless nested_resource? && current_record.present?

          related_records_query.preload(query)
        end

        def serializer_class
          "CoreDataConnector::Public::V1::#{"#{controller_name}_serializer".classify}".constantize
        end

        private

        def related_records_query
          RelatedRecordsQuery.new(
            record: current_record,
            related_class: item_class,
            project_ids: params[:project_ids],
            project_model_relationship_uuid: params[:project_model_relationship_uuid]
          )
        end
      end
    end
  end
end