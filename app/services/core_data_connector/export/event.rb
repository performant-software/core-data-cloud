module CoreDataConnector
  module Export
    module Event
      extend ActiveSupport::Concern

      DATE_FORMAT = '%Y-%m-%d'

      class_methods do
        def export_preloads
          [:start_date, :end_date]
        end
      end

      included do
        # Includes
        include Base

        # Export attributes
        export_attribute :project_model_id
        export_attribute :uuid
        export_attribute :name
        export_attribute :description

        export_attribute(:start_date) do
          start_date&.start_date&.strftime(DATE_FORMAT)
        end

        export_attribute(:start_date_description) do
          start_date&.description
        end

        export_attribute(:end_date) do
          end_date&.start_date&.strftime(DATE_FORMAT)
        end

        export_attribute(:end_date_description) do
          end_date&.description
        end
      end
    end
  end
end