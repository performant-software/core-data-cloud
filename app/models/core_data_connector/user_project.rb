module CoreDataConnector
  class UserProject < ApplicationRecord
    # Constants
    ROLE_OWNER = 'owner'
    ROLE_EDITOR = 'editor'
    ALLOWED_ROLES = [
      ROLE_OWNER,
      ROLE_EDITOR
    ]

    # Relationships
    belongs_to :user
    belongs_to :project

    # Transient attributes
    attr_accessor :name, :email

    # Validations
    validate :validate_project_owner
    validates :role, inclusion:  { in: ALLOWED_ROLES, message: I18n.t('errors.user_projects.roles') }
    validates :user_id, uniqueness: { scope: :project_id, message: I18n.t('errors.user_projects.unique') }

    # Callbacks
    after_commit :send_invitation, on: :create
    before_validation :find_or_create_user, on: :create

    private

    # Create the user record at the same time if the correct attributes are provided and no user_id is set. We'll
    # only update the name and password if the user is a new record.
    def find_or_create_user
      return unless user_id.nil? && name.present? && email.present?

      user = User.find_or_create_by(email: email) do |user|
        next unless user.new_record?

        # Generate a temporary password in order to create the user record. The password sent to the user
        # will be generated after the record is saved.
        temporary_password = Users::Passwords.generate_user_password

        user.assign_attributes(
          name: name,
          password: temporary_password,
          password_confirmation: temporary_password,
          password_temporary: true,
          role: User::ROLE_GUEST,
          require_password_change: true,
          skip_invitation: true  # prevent double invitation email from User callback
        )
      end

      self.user_id = user.id
    end

    def send_invitation
      return if ENV['VITE_AUTH_PROVIDER'] == 'clerk' || user.last_sign_in_at.present? || user.last_invited_at.present?

      Users::Invitations.new.send_invitation(self)
    end

    # Validates that the project has at least one owner
    def validate_project_owner
      return unless role == ROLE_EDITOR

      has_owner = project
                    .user_projects
                    .where(role: ROLE_OWNER)
                    .where.not(id: id)
                    .exists?

      errors.add(:role, I18n.t('errors.user_projects.role_owner')) unless has_owner
    end
  end
end