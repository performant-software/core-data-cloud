module CoreDataConnector
  class RecordTableQuery
    def initialize(source_model:, related_columns: [])
      @source_model     = source_model
      @related_columns  = related_columns
    end

    def call(base_scope = nil)
      scope    = base_scope || @source_model.all
      builders = build_builders

      builders.each { |b| b.joins.each { |j| scope = scope.joins(j) } }

      scope = apply_selects(scope, builders)
      scope = apply_grouping(scope, builders) if builders.any?(&:requires_aggregation?)
      scope
    end

    private

    def build_builders
      @related_columns.map do |col|
        CoreDataConnector::RelatedColumnJoinBuilder.new(
          source_model: @source_model,
          project_model_relationship_id: col[:pmr_id],
          field: col[:field]
        )
      end
    end

    def apply_selects(scope, builders)
      selects = ["#{@source_model.table_name}.*"]
      builders.each do |b|
        if b.requires_aggregation?
          expr = strip_alias(b.select_fragment)
          selects << "array_to_string((array_agg(DISTINCT (#{expr})::text " \
            "ORDER BY (#{expr})::text))[1:9], ', ') " \
            "|| CASE WHEN count(DISTINCT (#{expr})::text) > 9 " \
            "THEN ', ' || (count(DISTINCT (#{expr})::text) - 9) || ' more' ELSE '' END " \
            "AS #{b.column_alias}"
        else
          selects << b.select_fragment
        end
      end
      scope.select(selects.join(', '))
    end

    def apply_grouping(scope, builders)
      # PG lets you GROUP BY the PK and select any other column from that table.
      # But columns from non-aggregated joined tables must be in GROUP BY explicitly.
      group_cols = ["#{@source_model.table_name}.id"]
      builders.reject(&:requires_aggregation?).each do |b|
        group_cols << strip_alias(b.select_fragment)
      end
      scope.group(group_cols.join(', '))
    end

    def strip_alias(fragment)
      fragment.sub(/\s+AS\s+\S+\z/, '')
    end
  end
end