// @flow

import { BaseTransform } from '@performant-software/shared-components';
import { UserDefinedFieldsTransform } from '@performant-software/user-defined-fields';
import _ from 'underscore';
import ProjectModelAccessesTransform from './ProjectModelAccesses';
import ProjectModelRelationshipsTransform from './ProjectModelRelationships';
import ProjectModelSharesTransform from './ProjectModelShares';

/**
 * Class responsible for transforming project model records for POST/PUT requests.
 */
class ProjectModel extends BaseTransform {
  /**
   * Returns the project model parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'project_model';
  }

  /**
   * Returns the project model payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_id',
      'name',
      'model_class',
      'allow_identifiers',
      'allow_fcc_import'
    ];
  }

  /**
   * Transforms the project model payload after the record has been loaded.
   *
   * @param data
   *
   * @returns {{ data: {
   *   project_model: (*&{
   *    inverse_project_model_relationships: *,
   *    project_model_relationships: *,
   *    all_project_model_relationships: *
   *   }
   *  )
   * }}}
   */
  onLoad({ data }) {
    const { project_model: projectModel } = data;

    // Set the "url" property on all relationships.
    const relationships = _.map(
      projectModel.project_model_relationships,
      (relationship) => ({
        ...relationship,
        url: `/projects/${projectModel.project_id}/${relationship.related_model_id}`
      })
    );

    // Add the "inverse" property to all inverse relationships
    const inverseRelationships = _.map(
      projectModel.inverse_project_model_relationships,
      (relationship) => ({
        ...relationship,
        inverse: true,
        url: `/projects/${projectModel.project_id}/${relationship.primary_model_id}`
      })
    );

    // Sort all relationships by name
    const sortProjectModelRelationships = (relationship) => (
      relationship.inverse
        ? relationship.inverse_name
        : relationship.name
    );

    // Add a collection containing all of the relationships
    const allRelationships = _.sortBy([
      ...relationships,
      ...inverseRelationships
    ], sortProjectModelRelationships);

    return {
      data: {
        project_model: {
          ...projectModel,
          project_model_relationships: relationships,
          inverse_project_model_relationships: inverseRelationships,
          all_project_model_relationships: allRelationships
        }
      }
    };
  }

  /**
   * Returns the passed project model as a dropdown option.
   *
   * @param projectModel
   *
   * @returns {{text, value, key}}
   */
  toDropdown(projectModel) {
    return {
      key: projectModel.id,
      value: projectModel.id,
      text: projectModel.name
    };
  }

  /**
   * Returns the passed project model to send on POST/PUT requests.
   *
   * @param projectModel
   *
   * @returns {*}
   */
  toPayload(projectModel) {
    return super.toPayload(projectModel, {
      ...UserDefinedFieldsTransform.toPayload(projectModel),
      ...ProjectModelRelationshipsTransform.toPayload(projectModel),
      ...ProjectModelRelationshipsTransform.toPayload(projectModel, 'inverse_project_model_relationships'),
      ...ProjectModelAccessesTransform.toPayload(projectModel),
      ...ProjectModelSharesTransform.toPayload(projectModel)
    });
  }
}

const ProjectModelTransform: ProjectModel = new ProjectModel();
export default ProjectModelTransform;
