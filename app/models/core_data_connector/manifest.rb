module CoreDataConnector
  class Manifest < ApplicationRecord
    # Relationships
    belongs_to :manifestable, polymorphic: true
    belongs_to :project_model_relationship

    # Delegations
    delegate :project, to: :project_model_relationship

    # Validations
    validates :project_model_relationship_id, uniqueness: {
      scope: [:manifestable_id, :manifestable_type], message: I18n.t('errors.manifest.unique')
    }
  end
end