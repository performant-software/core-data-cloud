class UsersSerializer < BaseSerializer
  index_attributes :id, :name, :email
  show_attributes :id, :name, :email
end
