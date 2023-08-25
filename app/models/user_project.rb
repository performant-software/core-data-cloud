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

  # Resourceable parameters
  allow_params :user_id, :project_id, :role

  # Validations
  validates :role, inclusion:  { in: ALLOWED_ROLES, message: I18n.t('errors.user_project.roles') }
  validates :user_id, uniqueness: { scope: :project_id, message: I18n.t('errors.user_project.unique') }
end
