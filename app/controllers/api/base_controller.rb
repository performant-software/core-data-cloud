class Api::BaseController < Api::ResourceController
  # Includes
  include JwtAuth::Authenticateable

  protected

  def render_unauthorized
    render json: { errors: I18n.t('errors.delete.unauthorized') }, status: :unauthorized
  end
end
