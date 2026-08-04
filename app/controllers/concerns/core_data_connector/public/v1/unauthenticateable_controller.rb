module CoreDataConnector
  module Public
    module V1
      module UnauthenticateableController
        extend ActiveSupport::Concern

        included do
          # No user authentication
          skip_before_action :handle_authentication
        end

      end
    end
  end
end