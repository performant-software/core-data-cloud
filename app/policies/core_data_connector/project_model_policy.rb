module CoreDataConnector
  class ProjectModelPolicy < BasePolicy
    attr_reader :current_user, :project_model, :project

    def initialize(current_user, project_model)
      @current_user = current_user
      @project_model = project_model
      @project = project_model&.project
    end

    # A user can create project models if they are the owner of the project.
    def create?
      return true if current_user.admin?

      !project.archived? && owner?
    end

    # A user can delete project models if they are the owner of the project and the model is not shared with
    # another project.
    def destroy?
      return true if current_user.admin?

      !project.archived? && owner? && !shared?
    end

    # A user can view project models if they are a member of the project.
    def show?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can update project models if they are the owner of the project.
    def update?
      return true if current_user.admin?

      !project.archived? && owner?
    end

    def permitted_attributes
      [:project_id, :name, :model_class, :slug, :allow_identifiers, :order, *ProjectModel.permitted_params,
       project_model_relationships_attributes: [:id, :primary_model_id, :related_model_id, :name, :multiple, :slug,
                                                :allow_inverse, :inverse_name, :inverse_multiple, :order, :_destroy,
                                                *ProjectModelRelationship.permitted_params],
       inverse_project_model_relationships_attributes: [:id, :primary_model_id, :related_model_id, :name, :multiple, :slug,
                                                :allow_inverse, :inverse_name, :inverse_multiple, :order, :_destroy,
                                                *ProjectModelRelationship.permitted_params],
       project_model_accesses_attributes: [:id, :project_id, :_destroy],
       project_model_shares_attributes: [:id, :project_model_access_id, :_destroy]
      ]
    end

    private

    # Returns true if the current user has a `user_projects` record for the model's project.
    def member?
      current_user
        .user_projects
        .where(project_id: project_model.project_id)
        .exists?
    end

    # Returns true if the current user has an owner `user_projects` record for the model's project.
    def owner?
      current_user
        .user_projects
        .where(project_id: project_model.project_id)
        .where(role: UserProject::ROLE_OWNER)
        .exists?
    end

    # Returns true if the current project_model is shared with other projects.
    def shared?
      project_model.project_model_accesses.any?
    end

    # A user can view project models for any project of which they are a member.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        scope.where(
          UserProject
            .joins(:project)
            .where(UserProject.arel_table[:project_id].eq(ProjectModel.arel_table[:project_id]))
            .where(user_id: current_user.id)
            .where.not(project: { archived: true })
            .arel
            .exists
        )
      end
    end
  end
end