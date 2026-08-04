module CoreDataConnector
  module OwnableScope
    extend ActiveSupport::Concern

    included do
      def resolve
        return scope.all if current_user.admin?

        if scope.is_a?(Class)
          ownable_table = scope.arel_table
        elsif scope.is_a?(ActiveRecord::Relation)
          ownable_table = scope.klass.arel_table
        end

        owned_records_query = UserProject
                                .joins(project: :project_models)
                                .where(ProjectModel.arel_table[:id].eq(ownable_table[:project_model_id]))
                                .where(user_id: current_user.id)
                                .where.not(project: { archived: true })

        shared_records_query = ProjectModelShare
                                 .joins(project_model_access: [project: :user_projects])
                                 .where(ProjectModelAccess.arel_table[:project_model_id].eq(ownable_table[:project_model_id]))
                                 .where(core_data_connector_user_projects: { user_id: current_user.id })
                                 .where.not(project: { archived: true })

        scope.where(owned_records_query.arel.exists)
             .or(scope.where(shared_records_query.arel.exists))
      end
    end
  end
end