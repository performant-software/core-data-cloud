module CoreDataConnector
  class ProjectsController < ApplicationController
    # Search attributes
    search_attributes :name

    def analyze_import
      render json: { errors: [I18n.t('errors.projects.import_data')] }, status: :bad_request and return unless params[:file].present?

      project = Project.find(params[:id])
      authorize project

      service = ImportAnalyze::Helper.new

      begin
        data = service.analyze(params[:file], current_user)
      rescue StandardError => error
        errors = [error]

        # Log the error
        log_error(error)
      end

      if errors.nil? || errors.empty?
        render json: data, status: :ok
      else
        render json: { errors: errors }, status: :bad_request
      end
    end

    def clear
      project = Project.find(params[:id])
      authorize project

      # Query for models that are not shared with other projects
      project_models = ProjectModel
                         .unshared
                         .where(project_id: project.id)

      begin
        project_models.map(&:clear)
      rescue StandardError => error
        errors = [error]

        # Log the error
        log_error error
      end

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :bad_request
      end
    end

    def export_configuration
      project = Project.find(params[:id])
      authorize project

      options = load_records(project)
      serializer = ProjectConfigurationsSerializer.new(current_user, options)

      json = { param_name.to_sym => serializer.render_show(project) }
      render json: json, status: :ok
    end

    def export_data
      project = Project.find(params[:id])
      authorize project

      begin
        job = Job.create(
          job_type: Job::JOB_TYPE_EXPORT,
          project_id: project.id,
          user: current_user
        )

        errors = job&.errors
      rescue StandardError => error
        errors = [error]

        log_error error
      end

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :bad_request
      end
    end

    def export_variables
      project = Project.find(params[:id])
      authorize project

      serializer = ProjectVariablesSerializer.new(current_user)

      json = { param_name.to_sym => serializer.render_show(project) }
      render json: json, status: :ok
    end

    def import_analyze
      project = Project.find(params[:id])
      authorize project

      begin
        service = ImportAnalyze::Helper.new
        errors = service.import(params[:files], current_user, project.id)
      rescue StandardError => error
        errors = [error]
      end

      # Log any errors
      errors.each { |e| log_error(e) }

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :unprocessable_entity
      end
    end

    def import_configuration
      render json: { errors: [I18n.t('errors.projects.import_configuration')] }, status: :bad_request and return unless params[:file].present?

      project = Project.find(params[:id])
      authorize project

      begin
        service = Configuration.new(project, params[:file])
        service.import_configuration
      rescue StandardError => error
        errors = [error]

        # Log the error
        log_error(error)
      end

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :unprocessable_entity
      end
    end

    def import_data
      render json: { errors: [I18n.t('errors.projects.import_data')] }, status: :bad_request and return unless params[:file].present?

      project = Project.find(params[:id])
      authorize project

      begin
        job = Job.create(
          file: params[:file],
          job_type: Job::JOB_TYPE_IMPORT,
          user: current_user,
          project:
        )

        errors = job&.errors
      rescue StandardError => error
        errors = [error]

        log_error(error)
      end

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :unprocessable_entity
      end
    end

    def map_library
      project = Project.find(params[:id])
      authorize project

      library = MapLibrary.new(project.map_library_url)
      json = library.fetch_library || []

      render json: json, status: :ok
    end

    protected

    # If we're not looking for "discoverable" projects, use base query defined by the policy. Otherwise, return
    # a query to find all discoverable projects not matching the current project.
    def base_query
      return super unless params[:discoverable].to_s.to_bool && params[:project_id].present?

      Project
        .where(discoverable: true)
        .where.not(id: params[:project_id])
    end

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
end