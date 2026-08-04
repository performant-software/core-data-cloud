module CoreDataConnector
  module Reconcile
    class ProjectsSerializer < BaseSerializer

      index_attributes :id, :name, :description, :score, :match, :type

      def render_multiple(searches)
        searches.keys.inject({}) do |hash, key|
          hash[key] = {
            result: render_index(searches[key])
          }

          hash
        end
      end

      def render_manifest(project)
        # construct default types for filtered queries based on project models
        default_types = []
        models_by_class = project.project_models
          .group_by(&:model_class)
          .sort_by do |model_class_name, models|
            # sort by min :order of all models of this model_class, to match fairdata ui
            min_order = models.filter_map(&:order).min || Float::INFINITY
            [min_order, model_class_name]
          end
        models_by_class.each do |model_class_name, models|
          # add "All" option if there's more than one model with this model_class
          if models.size > 1
            default_types << {
              id: "type:#{model_class_name}",
              name: "#{model_class_name.demodulize}: All #{model_class_name.demodulize.pluralize}"
            }
          end
          # add each model on this project as an option
          models.sort_by { |m| [m.order || Float::INFINITY, m.name.downcase] }.each do |pm|
            default_types << {
              id: "model:#{pm.id}",
              name: "#{model_class_name.demodulize}: #{pm.name}"
            }
          end
        end

        {
          defaultTypes: default_types,
          identifierSpace: "#{ENV['HOSTNAME']}/core_data/public/v1",
          name: I18n.t('services.reconcile.name'),
          schemaSpace: "#{ENV['HOSTNAME']}/core_data/reconcile",
          versions: %w(0.1 0.2),
          view: {
            url: "#{ENV['HOSTNAME']}/core_data/reconcile/projects/#{project.id}/view/{{id}}"
          }
        }
      end

    end
  end
end