module CoreDataConnector
  class ApplicationController < Api::ResourceController
    # Includes
    include JwtAuth::Authenticateable
    include ClerkAuthenticatable

    # Errors
    rescue_from ArgumentError, with: :render_bad_request

    # Actions
    skip_before_action :authenticate_request
    before_action :handle_authentication, :set_paper_trail_whodunnit

    def item_class
      "CoreDataConnector::#{controller_name.singularize.classify}".constantize
    end

    def serializer_class
      "CoreDataConnector::#{"#{controller_name}_serializer".classify}".constantize
    end

    protected

    def user_for_paper_trail
      current_user&.id
    end

    def info_for_paper_trail
      { request_uuid: request.uuid }
    end

    private

    def handle_authentication
      if is_clerk?
        authenticate_clerk_request
      else
        authenticate_request
      end
    end

    def log_error(error)
      Rails.logger.error (["#{self.class} - #{error.class}: #{error.message}", error.backtrace]).join("\n")
    end

    def render_bad_request(error)
      render json: { errors: [{ base: error.message }] }, status: :bad_request
    end
  end
end
