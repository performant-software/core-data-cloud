module CoreDataConnector
  class WebAuthority < ApplicationRecord
    SOURCE_TYPES = %w(atom bnf dpla geonames jisc viaf wikidata)

    # Relationships
    belongs_to :project
    has_many :web_identifiers, dependent: :destroy

    # Validations
    validates :source_type, inclusion: { in: SOURCE_TYPES }
    validates :source_type, uniqueness: { scope: :project_id, message: I18n.t('errors.web_authority.source_type_unique') }
  end
end