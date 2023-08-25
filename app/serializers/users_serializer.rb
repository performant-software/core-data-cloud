class UsersSerializer < BaseSerializer
  index_attributes :id, :name, :email, :admin
  show_attributes :id, :name, :email, :admin
end
