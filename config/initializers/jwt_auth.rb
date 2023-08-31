JwtAuth.configure do |config|
  config.model_class = 'User'
  config.login_attribute = 'email'
  config.user_serializer = 'UsersSerializer'
end
