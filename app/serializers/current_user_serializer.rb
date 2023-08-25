class CurrentUserSerializer < UsersSerializer
  show_attributes(:permissions) do |user|
    obj = {}

    # Include accessible projects
    obj[:projects] = user.user_projects.pluck(:project_id, :role).map do |project_id, role|
      { project_id: project_id, role: role }
    end

    obj
  end
end
