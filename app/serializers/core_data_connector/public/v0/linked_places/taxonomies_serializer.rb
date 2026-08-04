module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class TaxonomiesSerializer < Base
          annotation_attributes(:id) { |taxonomy| "#{base_url}/taxonomies/#{taxonomy.uuid}" }
          annotation_attributes(:record_id) { |taxonomy| taxonomy.id }
          annotation_attributes(:title) { |taxonomy| taxonomy.name }
          annotation_attributes(:type) { 'Taxonomy' }
          annotation_attributes :uuid, user_defined: UserDefinedSerializer
        end
      end
    end
  end
end