module CoreDataConnector
  class UsersSerializer < BaseSerializer
    index_attributes :id, :name, :email, :role, :require_password_change, :last_sign_in_at, :last_invited_at, :avatar_url

    show_attributes :id, :name, :email, :role, :require_password_change, :last_sign_in_at, :last_invited_at, :avatar_url,
                    user_projects: UserProjectsSerializer
  end
end