module CoreDataConnector
  class PlacePolicy < BasePolicy
    attr_reader :current_user, :place

    def initialize(current_user, place)
      @current_user = current_user
      @place = place
    end

    # Users can create places if they have a membership in the related project.
    def create?
      return true if current_user.admin?

      member?
    end

    # Users can delete places if they have a membership in the related project.
    def destroy?
      return true if current_user.admin?

      member?
    end

    # Users can view places if they have a membership in the related project.
    def show?
      return true if current_user.admin?

      member?
    end

    # Users can update places if they have a membership in the related project.
    def update?
      return true if current_user.admin?

      member?
    end

    # Returns true if the current user is a member of the project to which the place belongs.
    def member?
      current_user
        .user_projects
        .where(project_id: place.project_item&.project_id)
        .exists?
    end

    # Admin users can view all places. Non-admin users can view places owned by any of the projects for which
    # they are a member.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        project_items = ProjectItem.arel_table
        places = CoreDataConnector::Place.arel_table

        CoreDataConnector::Place
          .where(
            ProjectItem
              .joins(project: :user_projects)
              .where(project_items[:projectable_id].eq(places[:id]))
              .where(projectable_type: CoreDataConnector::Place.to_s)
              .where(user_projects: { user_id: current_user.id })
              .arel.exists
          )
      end
    end
  end
end
