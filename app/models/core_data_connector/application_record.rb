module CoreDataConnector
  class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true

    # Includes
    include Resourceable
  end
end
