module CoreDataConnector
  module Public
    module V1
      class ProjectsController < ApplicationController
        include UnauthenticateableController

        def descriptors
          descriptors = DescriptorsQuery.new(params[:id]).call

          render json: { descriptors: descriptors}, status: :ok
        end
      end
    end
  end
end