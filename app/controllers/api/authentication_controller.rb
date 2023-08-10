class Api::AuthenticationController < Api::BaseController
  # Actions
  skip_before_action :authenticate_request

  DEFAULT_EXPIRATION = '24'

  def login
    user = User.find_by_email(params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      time = Time.now + ENV.fetch('AUTHENTICATION_EXPIRATION') { DEFAULT_EXPIRATION }.to_i.hours.to_i
      render json: { token: token, exp: time.iso8601, username: user.email }, status: :ok
    else
      render json: { error: 'unauthorized' }, status: :unauthorized
    end
  end
end
