class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Includes
  include Resourceable
end
