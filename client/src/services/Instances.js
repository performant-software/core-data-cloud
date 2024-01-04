// @flow

import { BaseService } from '@performant-software/shared-components';
import InstanceTransform from '../transforms/Instance';

/**
 * Class responsible for handling all Instance API requests.
 */
class Instances extends BaseService {
  /**
   * Returns the Instance base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/instances';
  }

  /**
   * Returns the Instance transform object.
   *
   * @returns {InstanceTransform}
   */
  getTransform(): typeof InstanceTransform {
    return InstanceTransform;
  }
}

const instancesService: Instances = new Instances();
export default instancesService;
