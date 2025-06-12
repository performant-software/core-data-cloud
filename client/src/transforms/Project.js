// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Option as OptionType } from '../types/Option';
import type { Project as ProjectType } from '../types/Project';

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
    return 'project';
  }

  /**
   * Returns the project payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'name',
      'description',
      'discoverable',
      'faircopy_cloud_url',
      'faircopy_cloud_project_model_id',
      'map_library_url',
      'archived'
    ];
  }

  /**
   * Returns the passed project as a dropdown option.
   *
   * @param project
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(project: ProjectType): OptionType {
    return {
      key: project.id,
      value: project.id,
      text: project.name
    };
  }

  /**
   * Returns the form data for the passed import.
   *
   * @param file
   *
   * @returns {FormData}
   */
  toFileImport(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return formData;
  }
}

const ProjectTransform: Project = new Project();
export default ProjectTransform;
