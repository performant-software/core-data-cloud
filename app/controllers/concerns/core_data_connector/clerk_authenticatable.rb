# Conditionally require Clerk because it injects some sort of
# extra auth layer that breaks username/password auth.
if ENV['VITE_AUTH_PROVIDER'] == 'clerk'
  require 'clerk'
end

module CoreDataConnector
  module ClerkAuthenticatable
    private

    def authenticate_clerk_request
      token = clerk_token
      return render_unauthorized unless token.present?

      clerk_session = clerk_client.verify_token(token)
      clerk_id = clerk_session["sub"]

      @current_user = User.find_by(sso_id: clerk_id)

      # If the user exists in Clerk but not in FairData,
      # create a local account for them automatically.
      if @current_user.nil?
        clerk_user = get_clerk_data(clerk_id)
        @current_user = create_user_from_clerk(clerk_user)
      end

      return render_not_found unless @current_user

      @current_user
    rescue StandardError => error
      log_error(error)
      render_unauthorized
    end

    def create_user_from_clerk(clerk_user)
      user = User.new(
        sso_id: clerk_user.id,
        email: clerk_user.email_addresses.first.email_address,
        name: [clerk_user.first_name, clerk_user.last_name].join(" "),
        role: 'member',
        # satisfy the Rails validator even though we won't be using this password
        password: Users::Passwords.generate_user_password,
        require_password_change: false
      )

      user.save!

      user
    end

    # The Clerk-issued JWT to verify: the __session cookie set by a browser,
    # or a Bearer token from a non-browser client (the pstudio CLI's OAuth
    # login). Both are Clerk JWTs, verified the same way against Clerk's JWKS;
    # sub is the Clerk user id in either case.
    def clerk_token
      request.cookies["__session"].presence || bearer_token
    end

    def bearer_token
      header = request.headers["Authorization"]
      return nil unless header&.start_with?("Bearer ")

      header.split(" ", 2).last
    end

    def get_clerk_data(clerk_id)
      clerk_client.users.get(user_id: clerk_id).user
    end

    def clerk_client
      @clerk_client ||= Clerk::SDK.new(secret_key: ENV.fetch("CLERK_SECRET_KEY"))
    end

    def render_unauthorized
      render json: { error: I18n.t("errors.users.unauthorized") }, status: :unauthorized
    end

    def render_not_found
      render json: { error: I18n.t("errors.users.not_found") }, status: :unauthorized
    end

    # Returns whether to use Clerk to authenticate the request
    def is_clerk?
      # backward compat for FCC 1's username/password login
      return false if request.headers['client'] == 'faircopy-cloud-1'

      # backward compat for FCC 2's username/password login
      return false if request.headers['user-agent'] == 'node'

      ENV['VITE_AUTH_PROVIDER'] == 'clerk'
    end
  end
end