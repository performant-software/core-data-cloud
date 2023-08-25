class Permissions
  # A user can delete a project if they are an admin or an owner of the project
  def self.can_delete_project?(user, project_id)
    return true if user.admin?

    user.user_projects
      .where(project_id: project_id)
      .where(role: UserProject::ROLE_OWNER)
      .exists?
  end
end
