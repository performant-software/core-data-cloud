module CoreDataConnector
  module Public
    module V1
      module NestableController
        extend ActiveSupport::Concern

        NESTABLE_PARAMS = %i(event_id instance_id item_id organization_id person_id place_id work_id)

        included do
          # Member attributes
          attr_reader :current_record

          # Actions
          before_action :set_current_record

          def nested_resource?
            NESTABLE_PARAMS.any? { |p| params[p].present? }
          end

          private

          def set_current_record
            if params[:event_id].present?
              @current_record = Event.find_by_uuid(params[:event_id])
            elsif params[:instance_id].present?
              @current_record = Instance.find_by_uuid(params[:instance_id])
            elsif params[:item_id].present?
              @current_record = Item.find_by_uuid(params[:item_id])
            elsif params[:organization_id].present?
              @current_record = Organization.find_by_uuid(params[:organization_id])
            elsif params[:person_id].present?
              @current_record = Person.find_by_uuid(params[:person_id])
            elsif params[:place_id].present?
              @current_record = Place.find_by_uuid(params[:place_id])
            elsif params[:work_id].present?
              @current_record = Work.find_by_uuid(params[:work_id])
            end
          end
        end
      end
    end
  end
end