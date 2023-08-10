class Api::UsersController < Api::BaseController
  search_attributes :name, :email
end
