module CoreDataConnector
  module Public
    module V0
      module UnauthenticateableController
        extend ActiveSupport::Concern

        included do
          # No user authentication
          skip_before_action :handle_authentication

          # No Pundit authorization
          before_action :bypass_authorization

          protected

          def find_record(query)
            query.find_by_uuid(params[:id])
          end
        end

      end
    end
  end
end