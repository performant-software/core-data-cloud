require 'csv'

module CoreDataConnector
  module ImportAnalyze
    class Import

      FILE_RELATIONSHIPS = 'relationships.csv'
      FILE_WEB_IDENTIFIERS = 'web_identifiers.csv'

      def analyze(directory)
        data = {}

        pattern = File.join(directory, '*.csv')

        Dir.glob(pattern).each do |filepath|
          filename = File.basename(filepath)

          # Analyzing web identifiers is currently not supported
          next if filename == FILE_WEB_IDENTIFIERS

          klass = find_class(filename)

          user_defined_columns = Helper.user_defined_columns(filepath)
          user_defined_fields_uuids = user_defined_columns.map { |c| Helper.column_name_to_uuid(c) }

          user_defined_fields = UserDefinedFields::UserDefinedField
                                  .where(uuid: user_defined_fields_uuids)

          attributes = build_attributes(klass, user_defined_fields)
          uuids = find_record_uuids(filepath)

          records_by_uuid = find_records_by_uuid(klass, uuids)
          merges_by_uuid = find_merges_by_uuid(klass, uuids)

          CSV.foreach(filepath, headers: true, converters: [:numeric]) do |row|
            data[filename] ||= { attributes: attributes, data: [] }

            row_hash = row_to_csv(row, user_defined_fields)
            record = records_by_uuid[row_hash[:uuid]]

            if record.present?
              db = record_to_csv(record, user_defined_fields)
              merged = record.record_merges.map { |rm| rm.merged_uuid } if record.is_a?(Mergeable)
            end

            data[filename][:data] << {
              import: row_hash,
              db: db,
              merged: merged,
              result: db || row_hash
            }

            # If the current record has been merged and removed, add a row for the record existing in the database. The
            # merged row will be picked up below and flagged as a merged record.
            merge_record = merges_by_uuid[row_hash[:uuid]]

            if merge_record.present?
              # If multiple records in the current import have been merged into an existing record, only add one
              # record to the file. Other duplicates will be listed in the "merged" attribute.
              existing = data[filename][:data].select { |r| r[:merged]&.include?(row_hash[:uuid]) }

              if !existing.present?
                merge_row_hash = record_to_csv(merge_record, user_defined_fields)

                data[filename][:data] << {
                  import: merge_row_hash,
                  db: merge_row_hash,
                  merged: merge_record.record_merges.map { |rm| rm.merged_uuid },
                  result: merge_row_hash
                }
              end
            end
          end
        end

        # Iterate over the data set and remove any already merged rows, adding them to the "merged" attribute
        # for the row of the primary record.
        relationship_data = data.dig(FILE_RELATIONSHIPS, :data)

        data.keys.each do |filename|
          rows = data[filename][:data]

          rows.each do |row|
            next unless row[:merged].present?

            # Find the rows containing the duplicates and add them to the current row
            duplicates = []

            row[:merged].each do |uuid|
              # Find all of the records in the current file that have been merged into the current row
              duplicate = rows.select { |r| r[:import][:uuid] == uuid }&.first
              duplicates << duplicate if duplicate.present?

              # Move to the next record if no relationship data is present
              next unless relationship_data.present?

              # Update relationships where the "primary_record_uuid" matches the merged row
              update_relationships(relationship_data, :primary_record_uuid, uuid, row[:import][:uuid])

              # Update relationships where the "related_record_uuid" matches the merged row
              update_relationships(relationship_data, :related_record_uuid, uuid, row[:import][:uuid])
            end

            row[:duplicates] = duplicates.map { |d| d[:import] }

            # Delete the duplicate rows
            duplicates.each { |d| rows.delete(d) }
          end

        end

        # De-duplicate relationships
        relationship_data&.each&.with_index do |row, i|
          next if row[:keep].present?

          # Find relationship rows where all fields match the current row except the index
          relationship = row[:import].except(:uuid)
          duplicates = relationship_data.select.with_index { |r, j|  i != j && r[:import].except(:uuid) == relationship }

          # Keep row with an existing record in the database, or the first. Mark all other for delete.
          all = [row, *duplicates]
          keep = all.select{ |r| r[:db].present? }&.first
          keep = all.first unless keep.present?

          keep[:keep] = true
          (all - [keep]).each{ |r| r[:keep] = false }
        end

        # Remove any rows not marked with "keep"
        relationship_data.delete_if { |r| r[:keep] != true } if relationship_data.present?

        data
      end

      def create_zip(files)
        return nil unless files.present?

        # Create the temporary directory
        directory = FileSystem.create_directory

        # Generate the CSV files from the passed files hash
        files.keys.each do |filename|
          CSV.open("#{directory}/#{filename}", 'w') do |csv|
            records = files[filename][:data]
            csv << records.first.keys

            records.each do |record|
              csv << record.values
            end
          end
        end

        # Zip the generated CSV files
        zipfile_name = "#{directory}/archive.zip"
        pattern = File.join(directory, '*.csv')

        Zip::File.open(zipfile_name, create: true) do |zipfile|
          Dir.glob(pattern).each do |filepath|
            zipfile.add(File.basename(filepath), filepath)
          end
        end

        # Return the file path to the created zip file
        zipfile_name
      end

      def remove_duplicates(project_id, filenames)
        return unless project_id.present? && filenames.present?

        service = Merge::Merger.new

        filenames.each do |filename|
          klass = find_class(filename)
          grouped_duplicates = klass.find_duplicates(project_id)

          next if grouped_duplicates.empty?

          grouped_duplicates.each do |group|
            primary = klass.preload(ImportAnalyze::Helper::PRELOADS).find(group.primary_id)
            duplicates = klass.preload(ImportAnalyze::Helper::PRELOADS).where(id: group.duplicate_ids)

            service.merge(primary, duplicates)
          end
        end
      end

      private

      def apply_preloads(klass, records)
        if klass.ancestors.include?(Mergeable)
          Preloader.new(
            records: records,
            associations: [:record_merges]
          ).call
        end

        # Preload any associations from the concrete class
        if klass.respond_to?(:export_preloads) && klass.export_preloads.present?
          Preloader.new(
            records: records,
            associations: klass.export_preloads
          ).call
        end
      end

      def build_attributes(klass, user_defined_fields)
        attributes = []

        klass.export_attributes.each do |attribute|
          attributes << {
            name: attribute[:name],
            label: translate(klass, attribute)
          }
        end

        serializer = UserDefinedFields::UserDefinedFieldsSerializer.new

        user_defined_fields.each do |user_defined_field|
          attributes << {
            name: Helper.uuid_to_column_name(user_defined_field.uuid),
            label: user_defined_field.column_name,
            field: serializer.render_show(user_defined_field)
          }
        end

        attributes
      end

      def find_class(filename)
        "CoreDataConnector::#{File.basename(filename, '.csv').singularize.capitalize}".classify.constantize
      end

      def find_record_uuids(filepath)
        uuids = []

        CSV.foreach(filepath, headers: true, converters: [:numeric]) do |row|
          uuids << row.to_h.symbolize_keys[:uuid]
        end

        uuids
      end

      def find_merges_by_uuid(klass, uuids)
        return {} unless klass.ancestors.include?(Mergeable)

        merges_by_uuid = {}

        query = klass.all
        query = query.merge(klass.export_query) if klass.respond_to?(:export_query)

        query = query.where(
          RecordMerge
            .where(RecordMerge.arel_table[:mergeable_id].eq(klass.arel_table[:id]))
            .where(mergeable_type: klass.to_s)
            .where(merged_uuid: uuids)
            .arel
            .exists
        )

        query.find_in_batches(batch_size: 1000) do |records|
          apply_preloads klass, records

          records.each do |record|
            record.record_merges.each do |record_merge|
              merges_by_uuid[record_merge.merged_uuid] = record
            end
          end
        end

        merges_by_uuid
      end

      def find_records_by_uuid(klass, uuids)
        records_by_uuid = {}

        query = klass.all
        query = query.merge(klass.export_query) if klass.respond_to?(:export_query)
        query = query.where(uuid: uuids)

        query.find_in_batches(batch_size: 1000) do |records|
          apply_preloads klass, records

          records.each do |record|
            records_by_uuid[record.uuid] = record
          end
        end

        records_by_uuid
      end

      def record_to_csv(record, user_defined_fields)
        csv = record.to_export_csv(user_defined_fields)

        user_defined_fields.each do |user_defined_field|
          key = Helper.uuid_to_column_name(user_defined_field.uuid)

          # If the value exists in the hash, extract it. Otherwise add the key to the hash with a nil value.
          if csv.key?(key)
            value = csv[key]
          else
            csv[key] = nil
          end

          next unless value.present?

          # Since the "to_export_csv" method will serialize JSON to strings, we'll convert it back to JSON
          # here in order to do proper comparison on the client.
          if (user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:select] &&
            user_defined_field.allow_multiple?) ||
            user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:fuzzy_date]
            csv[key] = JSON.parse(value)
          end
        end

        csv
      end

      def row_to_csv(row, user_defined_fields)
        csv = row.to_h

        user_defined_fields.each do |user_defined_field|
          key = Helper.uuid_to_column_name(user_defined_field.uuid)
          next unless csv[key].present?

          if user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:boolean] ||
            user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:number] ||
            user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:string]
            csv[key] = csv[key].to_s
          elsif user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:select] &&
            user_defined_field.allow_multiple?
            csv[key] = JSON.parse(csv[key])
          elsif user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:fuzzy_date]
            csv[key] = JSON.parse(csv[key])
          end
        end

        csv.symbolize_keys
      end

      def translate(klass, attribute)
        model_path = "services.import_analyze.#{klass.model_name.route_key}.#{attribute[:name]}"
        common_path = "services.import_analyze.common.#{attribute[:name]}"

        I18n.t(model_path, default: nil) || I18n.t(common_path, default: nil) || attribute[:name]
      end

      def update_relationships(relationship_data, attribute, find_uuid, new_uuid)
        relationships = relationship_data.select{ |r| r[:import][attribute] == find_uuid }

        relationships.each do |relationship|
          # Create the new relationships row
          new_relationship = relationship[:import].merge({ attribute => new_uuid })

          # Add the new row to the relationships data set
          relationship_data << { import: new_relationship }

          # Delete the existing relationship
          relationship_data.delete(relationship)
        end
      end
    end
  end
end