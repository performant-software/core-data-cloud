JwtAuth.configure do |config|
  config.model_class = 'CoreDataConnector::User'
  config.login_attribute = 'email'
  config.user_serializer = 'CoreDataConnector::UsersSerializer'
end

TripleEyeEffable.configure do |config|
  config.api_key = ENV['IIIF_CLOUD_API_KEY']
  config.url = ENV['IIIF_CLOUD_URL']
  config.project_id = ENV['IIIF_CLOUD_PROJECT_ID']
  config.base_controller = 'CoreDataConnector::DirectUploadsController'
end

Rails.application.config.to_prepare do
  JwtAuth::AuthenticationController.prepend(CoreDataConnector::AuthenticationControllerOverride)
end
