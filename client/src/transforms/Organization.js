// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationNames from './OrganizationNames';

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
      'project_model_id',
      'description'
    ];
  }

  /**
   * Returns the passed organization as a dropdown option.
   *
   * @param organization
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(organization: OrganizationType) {
    return {
      key: organization.id,
      value: organization.id,
      text: organization.name
    };
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
      ...OrganizationNames.toPayload(organization)
    });
  }
}

const OrganizationTransform: Organization = new Organization();
export default OrganizationTransform;
