class User < ApplicationRecord
  # Relationships
  has_many :user_projects, dependent: :destroy

  # Resourceable parameters
  allow_params :name, :email, :password, :password_confirmation, :admin

  # JWT
  has_secure_password
end
