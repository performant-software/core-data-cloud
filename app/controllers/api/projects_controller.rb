class Api::ProjectsController < Api::BaseController
  # Search attributes
  search_attributes :name

  protected

  # Automatically add the user who created the project as the owner, if they are not an admin.
  def after_create(project)
    return if current_user.admin?

    UserProject.create(
      project_id: project.id,
      user_id: current_user.id,
      role: UserProject::ROLE_OWNER
    )
  end
end
