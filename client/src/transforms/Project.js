// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming project records for POST/PUT requests.
 */
class Project extends BaseTransform {
  /**
   * Returns the project parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'project'
  }

  /**
   * Returns the project payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'name',
      'description'
    ];
  }
}

const ProjectTransform: Project = new Project();
export default ProjectTransform;
