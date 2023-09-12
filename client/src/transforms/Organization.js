// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationNames from './OrganizationNames';
import ProjectItem from './ProjectItem';

/**
 * Class responsible for transforming organization records for POST/PUT requests.
 */
class Organization extends BaseTransform {
  /**
   * Returns the person parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'organization';
  }

  /**
   * Returns the organization payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'description'
    ];
  }

  /**
   * Returns the organization for POST/PUT requests as a plain Javascript object.
   *
   * @param organization
   *
   * @returns {*}
   */
  toPayload(organization: OrganizationType): any {
    return super.toPayload(organization, {
      ...ProjectItem.toPayload(organization),
      ...OrganizationNames.toPayload(organization)
    });
  }
}

const OrganizationTransform: Organization = new Organization();
export default OrganizationTransform;
