class Api::ProjectsController < Api::BaseController
  # Search attributes
  search_attributes :name

  # Actions
  before_action :validate_destroy, only: :destroy

  protected

  # Automatically add the user who created the project as the owner.
  def after_create(project)
    UserProject.create(
      project_id: project.id,
      user_id: current_user.id,
      role: UserProject::ROLE_OWNER
    )
  end

  # For non-admin users, only show projects for which the user has access
  def base_query
    return Project.all if current_user.admin?

    Project.where(
      UserProject
        .where(user_id: current_user.id)
        .where(UserProject.arel_table[:project_id].eq(Project.arel_table[:id]))
        .arel
        .exists
    )
  end

  private

  def validate_destroy
    render_unauthorized unless ::Permissions.can_delete_project?(current_user, params[:id])
  end
end
