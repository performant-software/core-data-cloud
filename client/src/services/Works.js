// @flow

import MergeableService from './Mergeable';
import WorkTransform from '../transforms/Work';

/**
 * Class responsible for handling all work API requests.
 */
class Works extends MergeableService {
  /**
   * Returns the work base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/works';
  }

  /**
   * Returns the work transform object.
   *
   * @returns {WorkTransform}
   */
  getTransform(): typeof WorkTransform {
    return WorkTransform;
  }
}

const WorksService: Works = new Works();
export default WorksService;
