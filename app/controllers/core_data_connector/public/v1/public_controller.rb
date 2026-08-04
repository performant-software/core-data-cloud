module CoreDataConnector
  module Public
    module V1
      class PublicController < ApplicationController
        # Includes
        include NestableController
        include UnauthorizeableController

        protected

        def base_query
          return item_class.none unless params[:project_ids].present?

          query = super

          if nested_resource? && current_record.present?
            query = query.joins(build_base_sql).order('record.order')
          elsif nested_resource?
            query = item_class.none
          elsif params[:id].present?
            query = query.where(uuid: params[:id])
          elsif params[:project_ids].present?
            query = query.merge(item_class.all_records_by_project(params[:project_ids]))
          else
            query = item_class.none
          end

          query
        end

        def find_record(query)
          query.find_by!(uuid: params[:id])
        end

        def policy_class
          CoreDataConnector::Public::V1::PublicPolicy
        end

        # Preloads the relationships records scoped to the passed project_ids
        def preloads(query)
          super

          return unless nested_resource? && current_record.present?

          primary_scope = Relationship
                            .joins(project_model_relationship: :related_model)
                            .where(
                              primary_record_type: item_class.to_s,
                              related_record_id: current_record.id,
                              related_record_type: current_record.class.to_s,
                              related_model: {
                                project_id: params[:project_ids]
                              },
                              project_model_relationship: {
                                allow_inverse: true
                              }
                            )

          if params[:project_model_relationship_uuid].present?
            primary_scope = primary_scope.where(project_model_relationship: {
              uuid: params[:project_model_relationship_uuid]
            })
          end

          Preloader.new(
            records: query,
            associations: [
              relationships: [
                project_model_relationship: :user_defined_fields
              ]
            ],
            scope: primary_scope
          ).call

          related_scope = Relationship
                            .joins(project_model_relationship: :primary_model)
                            .where(
                              related_record_type: item_class.to_s,
                              primary_record_id: current_record.id,
                              primary_record_type: current_record.class.to_s,
                              primary_model: {
                                project_id: params[:project_ids]
                              }
                            )

          if params[:project_model_relationship_uuid].present?
            related_scope = related_scope.where(project_model_relationship: {
              uuid: params[:project_model_relationship_uuid]
            })
          end

          Preloader.new(
            records: query,
            associations: [
              related_relationships: [project_model_relationship: :user_defined_fields]
            ],
            scope: related_scope
          ).call
        end

        def serializer_class
          "CoreDataConnector::Public::V1::#{"#{controller_name}_serializer".classify}".constantize
        end

        private

        def build_base_sql
          primary_query = Relationship
                            .joins(project_model_relationship: :primary_model)
                            .where(
                              related_record_type: item_class.to_s,
                              primary_record_id: current_record.id,
                              primary_record_type: current_record.class.to_s,
                              primary_model: {
                                project_id: params[:project_ids]
                              }
                            )
                            .select(Relationship.arel_table[:related_record_id].as('id'))
                            .select(Relationship.arel_table[:order].as('order'))

          if params[:project_model_relationship_uuid].present?
            primary_query = primary_query
                              .where(project_model_relationship: {
                                uuid: params[:project_model_relationship_uuid]
                              })
          end

          related_query = Relationship
                            .joins(project_model_relationship: :related_model)
                            .where(
                              primary_record_type: item_class.to_s,
                              related_record_id: current_record.id,
                              related_record_type: current_record.class.to_s,
                              related_model: {
                                project_id: params[:project_ids]
                              },
                              project_model_relationship: {
                                allow_inverse: true
                              }
                            )
                            .select(Relationship.arel_table[:primary_record_id].as('id'))
                            .select(Relationship.arel_table[:order].as('order'))

          if params[:project_model_relationship_uuid].present?
            related_query = related_query
                              .where(project_model_relationship: {
                                uuid: params[:project_model_relationship_uuid]
                              })
          end

          <<-SQL.squish
            INNER JOIN (
              #{primary_query.to_sql}
              UNION ALL
              #{related_query.to_sql}
            ) record ON record.id = "#{item_class.table_name}"."id"
          SQL
        end
      end
    end
  end
end