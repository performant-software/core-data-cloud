// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Projectable } from '../types/Projectable';

/**
 * Class responsible for transforming project item records for POST/PUT requests.
 */
class ProjectItem extends BaseTransform {
  /**
   * Returns the project item parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'project_item';
  }

  /**
   * Returns the project item payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_id'
    ];
  }

  /**
   * Returns the projectable for POST/PUT requests as a plain Javascript object.
   *
   * @param projectable
   *
   * @returns {*}
   */
  toPayload(projectable: Projectable): any {
    return super.toPayload(projectable.project_item);
  }
}

const ProjectItemTransform: ProjectItem = new ProjectItem();
export default ProjectItemTransform;
