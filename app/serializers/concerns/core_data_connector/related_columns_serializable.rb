module CoreDataConnector
  module RelatedColumnsSerializable
    def render_index(items)
      serialized = super
      return serialized if serialized.blank?

      aliases = options[:related_column_aliases] || []
      return serialized if aliases.empty?

      [items].flatten.each_with_index do |item, i|
        aliases.each do |alias_name|
          serialized[i][alias_name.to_sym] = item[alias_name]
        end
      end

      serialized
    end
  end
end
