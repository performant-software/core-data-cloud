module CoreDataConnector
  class ProjectModel < ApplicationRecord
    # Includes
    include Sluggable
    include UserDefinedFields::Defineable

    # Relationships
    belongs_to :project

    has_many :instances, dependent: :destroy
    has_many :items, dependent: :destroy
    has_many :organizations, dependent: :destroy
    has_many :people, dependent: :destroy
    has_many :places, dependent: :destroy
    has_many :project_model_accesses, dependent: :destroy
    has_many :project_model_shares, dependent: :destroy
    has_many :taxonomies, dependent: :destroy
    has_many :works, dependent: :destroy

    has_many :project_model_relationships, dependent: :destroy, foreign_key: :primary_model_id
    has_many :related_project_model_relationships, dependent: :destroy, class_name: ProjectModelRelationship.to_s, foreign_key: :related_model_id
    has_many :inverse_project_model_relationships, -> { where(allow_inverse: true) }, dependent: :destroy, class_name: ProjectModelRelationship.to_s, foreign_key: :related_model_id

    # Nested attributes
    accepts_nested_attributes_for :project_model_relationships, allow_destroy: true
    accepts_nested_attributes_for :inverse_project_model_relationships, allow_destroy: true
    accepts_nested_attributes_for :project_model_accesses, allow_destroy: true
    accepts_nested_attributes_for :project_model_shares, allow_destroy: true

    # Validations
    validates :name, presence: true
    validates :model_class, inclusion: { in: :valid_model_classes }

    # Destroys any records owned by the project_model
    def clear
      model_class
        .constantize
        .where(project_model_id: id)
        .destroy_all
    end

    # Returns a list of models that include the Ownable concern.
    def self.model_classes
      # Eager load all of the models in development mode
      Rails.application.eager_load! if Rails.env.development?

      # Return the list of values
      ApplicationRecord.descendants.select do |descendant|
        descendant.included_modules&.include?(Ownable) && descendant.model_name.present?
      end
    end

    # Returns a human readable model class name.
    def model_class_view
      model_class&.safe_constantize&.model_name&.human&.titleize
    end

    # Returns the singular version of the name.
    def name_singular
      name&.singularize
    end

    # Returns a query to find project_models records that are not shared with other projects.
    def self.unshared
      model_table = ProjectModel.arel_table
      access_table = ProjectModelAccess.arel_table

      where.not(
        ProjectModelAccess
          .where(access_table[:project_model_id].eq(model_table[:id]))
          .arel
          .exists
      )
    end

    private

    # Returns a list of valid model class names.
    def valid_model_classes
      self.class.model_classes.map(&:model_name).map(&:name)
    end
  end
end