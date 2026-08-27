module CoreDataConnector
  class User < ApplicationRecord
    # Roles
    ROLE_ADMIN = 'admin'
    ROLE_MEMBER = 'member'
    ROLE_GUEST = 'guest'

    ALLOWED_ROLES = [
      ROLE_ADMIN,
      ROLE_MEMBER,
      ROLE_GUEST
    ]

    # Relationships
    has_many :user_projects, dependent: :destroy

    # JWT
    has_secure_password

    # Transient attributes
    attr_accessor :password_temporary, :skip_invitation

    # Actions
    before_validation :set_temp_password, on: :create
    after_commit :send_invitation, on: :create

    # Validations
    validates :email, uniqueness: true
    validates :password,
              allow_nil: true,
              length: { in: 8..128 },
              format: { with: Users::Passwords::PASSWORD_FORMAT },
              unless: :password_temporary
    validates :role, inclusion:  { in: ALLOWED_ROLES, message: I18n.t('errors.users.roles') }

    def admin?
      role === ROLE_ADMIN
    end

    def authenticate(password)
      success = super

      # Update the user's last sign in at timestamp
      update(last_sign_in_at: Time.now.utc) if success

      success
    end

    def guest?
      role === ROLE_GUEST
    end

    def member?
      role === ROLE_MEMBER
    end

    def split_name
      self.name&.split(' ', 2)
    end

    private

    def set_temp_password
      return if password.present?
      temp = Users::Passwords.generate_user_password
      self.assign_attributes(
        password: temp,
        password_confirmation: temp,
        password_temporary: true,
        require_password_change: true
      )
    end

    def send_invitation
      return false if ENV['VITE_AUTH_PROVIDER'] == 'clerk' || last_sign_in_at.present? || skip_invitation

      Users::Invitations.new.send_invitation(self)
    end
  end
end
