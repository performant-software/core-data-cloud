module CoreDataConnector
  class Place < ApplicationRecord
    self.primary_key = :id

    # Includes
    include DisplayNameable
    include Export::Place
    include Identifiable
    include ImportAnalyze::Place
    include Manifestable
    include Mergeable
    include Nameable
    include Ownable
    include Reconcile::Place
    include Relateable
    include Search::Place
    include Auditable
    include UserDefinedFields::Fieldable

    # Audit logging
    track_changes

    # Relationships
    has_one :place_geometry, dependent: :destroy
    has_many :place_layers, dependent: :destroy

    # Nested attributes
    accepts_nested_attributes_for :place_geometry, allow_destroy: true
    accepts_nested_attributes_for :place_layers, allow_destroy: true

    # Nameable table
    name_table :place_names

    # Delegates
    delegate :name, to: :primary_name, allow_nil: true

    # User defined fields parent
    resolve_defineable -> (place) { place.project_model }

    def self.centroid_function
      Arel::Nodes::NamedFunction.new(
        'st_centroid',
        [PlaceGeometry.arel_table[:geometry]]
      ).as('geometry_center')
    end

    def self.with_centroid
      left_joins(:place_geometry)
        .select(arel_table[Arel.star], centroid_function)
    end

    def self.simplified_geometry_function(base_tolerance = 0.004)
      geometry_column = PlaceGeometry.arel_table[:geometry]

      tolerance = Arel::Nodes::NamedFunction.new(
        'greatest',
        [
          Arel::Nodes.build_quoted(base_tolerance),
          Arel::Nodes::Multiplication.new(
            Arel::Nodes.build_quoted(base_tolerance),
            Arel::Nodes::NamedFunction.new('sqrt', [
              Arel::Nodes::NamedFunction.new('st_area', [geometry_column])
            ])
          )
        ]
      )

      Arel::Nodes::NamedFunction.new(
        'st_simplify',
        [geometry_column, Arel::Nodes.build_quoted(tolerance)]
      ).as('simplified_geometry')
    end

    def self.with_search_geometry
      left_joins(:place_geometry)
        .select(
          arel_table[Arel.star],
          centroid_function,
          simplified_geometry_function
        )
    end
  end
end
