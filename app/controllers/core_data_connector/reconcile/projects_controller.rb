module CoreDataConnector
  module Reconcile
    class ProjectsController < ActionController::API

      def show
        # Validate that the requested project contains the necessary credentials to call the API
        project = Project.find(params[:id])
        credentials = project.reconciliation_credentials&.symbolize_keys

        render json: { }, status: :not_found and return unless valid_credentials? credentials

        serializer = ProjectsSerializer.new

        # Per the spec, a request to the API without any parameters should return the service manifest
        render json: serializer.render_manifest(project), status: :ok and return unless params[:queries].present?

        # Allow request body to be sent as application/json or x-www-form-urlencoded
        if params[:queries].is_a?(String)
          queries = JSON.parse(params[:queries]).deep_symbolize_keys
        else
          queries = params[:queries]
        end

        manager = Reconcile::Manager.new
        items = manager.send_request(queries, credentials)

        render json: serializer.render_multiple(items), status: :ok
      end

      def view
        # "view" endpoint for redirection to record's edit page

        # Validate that the requested project contains the necessary credentials to call the API
        project = Project.find(params[:id])
        credentials = project.reconciliation_credentials&.symbolize_keys

        render plain: 'Invalid credentials', status: :forbidden and return unless valid_credentials? credentials

        # attempt to connect to and get the record from typesense
        record_uuid = params[:record_id]
        client = Typesense.create_client(**credentials.except(:collection_name))
        collection = credentials[:collection_name]

        begin
          # build and redirect to the core-data-cloud redirect URL
          record = client.collections[collection].documents[record_uuid].retrieve
          project_model_id = record['project_model_id']
          record_id = record['record_id']
          redirect_url = "#{ENV['HOSTNAME']}/projects/#{project.id}/#{project_model_id}/#{record_id}"

          redirect_to redirect_url, allow_other_host: true
        rescue ::Typesense::Error::ObjectNotFound
          render plain: 'Record not found', status: :not_found
        end
      end

      private

      def valid_credentials?(credentials)
        return false unless credentials.present?

        parameters = %i(host protocol port api_key collection_name)
        return false unless parameters.all? { |parameter| credentials[parameter].present? }

        true
      end

    end
  end
end