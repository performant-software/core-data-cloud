module CoreDataConnector
  module Public
    module V1
      class ManifestsController < ApplicationController
        # Includes
        include NestableController
        include UnauthenticateableController
        include UnauthorizeableController

        # Disable pagination
        per_page 0

        protected

        def base_query
          # Manifests can only be retrieved for nested routes
          return Manifest.none unless current_record.present?

          # If not retrieving a single manifest, the project_ids parameter is required
          return Manifest.none unless params[:project_ids].present? || params[:id].present?

          query = super

          query = query
                    .joins(project_model_relationship: [:primary_model, :related_model])
                    .where(
                      manifestable_id: current_record.id,
                      manifestable_type: current_record.class.to_s
                    )

          if params[:project_ids].present?
            query = query.where(
              primary_model: {
                project_id: params[:project_ids]
              }
            ).or(
              query.where(related_model: {
                project_id: params[:project_ids]
              })
            )
          end

          query
        end

        def build_index_response(items, metadata)
          return {} if items.empty?

          parameters = {
            project_ids: params[:project_ids]
          }

          id = Iiif::Manifest.generate_identifier(
            model_class: current_record.class,
            uuid: current_record.uuid
          )

          service = TripleEyeEffable::Presentation.new

          service.create_collection(
            id: "#{ENV['HOSTNAME']}/#{id}/#{parameters.to_query}",
            label: label,
            items: items.map{ |i| to_collection_item(i) }
          )
        end

        def build_show_response(item)
          item&.content
        end

        def find_record(query)
          query
            .joins(:project_model_relationship)
            .where(project_model_relationship: {
              uuid: params[:id]
            })
            .take!
        end

        def policy_class
          CoreDataConnector::Public::V1::ManifestPolicy
        end

        private

        def label
          service = Iiif::Manifest.new
          service.find_label(current_record)
        end

        def to_collection_item(manifest)
          parameters = {
            project_ids: params[:project_ids]
          }

          {
            id: "#{ENV['HOSTNAME']}/#{manifest.identifier}?#{parameters.to_query}",
            type: 'Manifest',
            label: manifest.label,
            item_count: manifest.item_count,
            thumbnail: manifest.thumbnail
          }
        end
      end
    end
  end
end