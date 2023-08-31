class User < ApplicationRecord
  # Relationships
  has_many :user_projects, dependent: :destroy

  # JWT
  has_secure_password

  # Validations
  validates :email, uniqueness: true
end
