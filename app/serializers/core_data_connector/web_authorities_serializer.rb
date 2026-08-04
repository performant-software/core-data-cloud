module CoreDataConnector
  class WebAuthoritiesSerializer < BaseSerializer
    index_attributes :id, :source_type, :access
    show_attributes :id, :source_type, :access
  end
end