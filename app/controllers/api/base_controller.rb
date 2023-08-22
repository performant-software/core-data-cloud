class Api::BaseController < Api::ResourceController
  # Includes
  include JwtAuth::Authenticateable
end
