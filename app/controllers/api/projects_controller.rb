class Api::ProjectsController < Api::BaseController
  # Search attributes
  search_attributes :name

  protected

  def after_create(project)
    # Automatically add the user who created the project as the owner.
    UserProject.create(
      project_id: project.id,
      user_id: current_user.id,
      role: UserProject::ROLE_OWNER
    )
  end
end
