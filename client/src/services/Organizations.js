// @flow

import MergeableService from './Mergeable';
import OrganizationTransform from '../transforms/Organization';

/**
 * Class responsible for handling all organization API requests.
 */
class Organization extends MergeableService {
  /**
   * Returns the organization base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/organizations';
  }

  /**
   * Returns the organization transform object.
   *
   * @returns {OrganizationTransform}
   */
  getTransform(): typeof OrganizationTransform {
    return OrganizationTransform;
  }
}

const OrganizationsService: Organization = new Organization();
export default OrganizationsService;
