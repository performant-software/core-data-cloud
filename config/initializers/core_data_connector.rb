require 'extensions/core_data_connector/controllers/ownable_controller'
require 'extensions/core_data_connector/models/ownable'
require 'extensions/core_data_connector/serializers/ownable_serializer'

Rails.application.config.to_prepare do
  CoreDataConnector.configure do |config|
    config.base_controller = 'Api::BaseController'
  end

  CoreDataConnector::Place.include(Extensions::CoreDataConnector::Ownable)
  CoreDataConnector::PlacesController.include(Extensions::CoreDataConnector::OwnableController)
  CoreDataConnector::PlacesSerializer.include(Extensions::CoreDataConnector::OwnableSerializer)
end
