class User < ApplicationRecord
  # JWT
  has_secure_password

  # Resourceable parameters
  allow_params :name, :email, :password, :password_confirmation
end
