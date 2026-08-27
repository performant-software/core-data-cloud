module CoreDataConnector
  module AuthenticationControllerOverride
    include ClerkAuthenticatable

    def login
      if is_clerk?
        return render status: :unauthorized
      end

      super
    end
  end
end
