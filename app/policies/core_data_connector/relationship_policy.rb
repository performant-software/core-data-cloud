module CoreDataConnector
  class RelationshipPolicy < BasePolicy
    attr_reader :current_user, :relationship, :project, :project_id

    def initialize(current_user, relationship)
      @current_user = current_user
      @relationship = relationship
      @project = relationship&.project
      @project_id = relationship&.project_id
    end

    # A user can create a relationship if they are an admin or a member of the owning project.
    def create?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can create a relationship if they are an admin or a member of the owning project.
    def destroy?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can view a relationship if they are an admin or a member of the owning project.
    def show?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can update a relationship if they are an admin or a member of the owning project.
    def update?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # Returns true if the current user has a `user_projects` record for the project that owns the current record.
    def member?
      current_user
        .user_projects
        .where(project_id: project_id)
        .exists?
    end

    def permitted_attributes
      [ :project_model_relationship_id,
        :primary_record_id,
        :primary_record_type,
        :related_record_id,
        :related_record_type,
        :order,
        user_defined: {}
      ]
    end

    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        if scope.is_a?(Class)
          ownable_table = scope.arel_table
        elsif scope.is_a?(ActiveRecord::Relation)
          ownable_table = scope.klass.arel_table
        end

        scope
          .where(
            UserProject
              .joins(project: [project_models: :project_model_relationships])
              .where(ProjectModelRelationship.arel_table[:id].eq(ownable_table[:project_model_relationship_id]))
              .where(user_id: current_user.id)
              .where.not(project: { archived: true })
              .arel
              .exists
          )
      end
    end
  end
end