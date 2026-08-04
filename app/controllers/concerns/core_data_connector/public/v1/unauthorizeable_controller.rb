module CoreDataConnector
  module Public
    module V1
      module UnauthorizeableController
        extend ActiveSupport::Concern

        included do

          # Authorization errors
          rescue_from ActiveRecord::RecordNotFound, with: :unauthorized

          def unauthorized
            render json: { errors: [{ base: I18n.t('errors.general.not_found') }] }, status: :not_found
          end

        end
      end
    end
  end
end