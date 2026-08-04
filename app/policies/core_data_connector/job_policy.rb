module CoreDataConnector
  class JobPolicy < BasePolicy
    attr_reader :current_user, :job

    def initialize(current_user, job)
      @current_user = current_user
      @job = job
    end

    # Jobs cannot be created via the API.
    def create?
      false
    end

    # Only admin users can delete a job.
    def destroy?
      current_user.admin?
    end

    # Jobs cannot be viewed via the API.
    def show?
      false
    end

    # Jobs cannot be updated via the API.
    def update?
      false
    end

    # Admin users can view all jobs, other users can view no jobs.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        scope.none
      end
    end
  end
end