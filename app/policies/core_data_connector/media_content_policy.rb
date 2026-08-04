module CoreDataConnector
  class MediaContentPolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :media_content, :project_model_id, :project, :project_id

    def initialize(current_user, media_content)
      @current_user = current_user
      @media_content = media_content

      @project_model_id = media_content&.project_model_id
      @project = media_content&.project
      @project_id = media_content&.project_id
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        :name,
        :content,
        :content_warning,
        user_defined: {}
      ]
    end

    # Include default ownable scope.
    class Scope < BaseScope
      include OwnableScope
    end
  end
end