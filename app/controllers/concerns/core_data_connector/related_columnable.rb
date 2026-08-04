module CoreDataConnector
  module RelatedColumnable
    extend ActiveSupport::Concern

    protected

    def prepare_items(items)
      cols = permitted_related_columns
      return items if cols.empty? || items.empty?

      ids = items.map(&:id)
      prepared = CoreDataConnector::RecordTableQuery.new(
        source_model:    item_class,
        related_columns: cols
      ).call(item_class.where(id: ids)).index_by(&:id)

      # Preserve the order pagy gave us (which respects apply_sort)
      ids.map { |id| prepared[id] }.compact
    end

    def permitted_related_columns
      @permitted_related_columns ||= begin
                                       raw = params[:join_columns]

                                       base_columns = Array(raw).map do |c|
                                         split = c.split('_')
                                         next unless split.length == 3

                                         { pmr_id: split[1].to_i, field: split[2] }
                                       end

                                       base_columns.map { |c| c.respond_to?(:permit) ? c.permit(:pmr_id, :field) : c }
                                                   .reject { |c| c[:pmr_id].zero? || c[:field].empty? }
                                     end
    end

    def related_column_aliases
      permitted_related_columns.map do |c|
        "rel_#{c[:pmr_id]}_#{c[:field].gsub(/\W/, '_')}"
      end
    end

    def load_records(items)
      super.merge(related_column_aliases: related_column_aliases)
    end
  end
end