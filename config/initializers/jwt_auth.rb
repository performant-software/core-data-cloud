JwtAuth.configure do |config|
  config.model_class = 'CoreDataConnector::User'
  config.login_attribute = 'email'
  config.user_serializer = 'CoreDataConnector::UsersSerializer'
end
