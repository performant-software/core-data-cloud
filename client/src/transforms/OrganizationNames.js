// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { Organization as OrganizationType } from '../types/Organization';

/**
 * Class responsible for transforming organization names objects.
 */
class OrganizationNames extends NestedAttributesTransform {
  /**
   * Returns the organization names payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'name',
      'primary',
      '_destroy'
    ];
  }

  /**
   * Returns the organization names for the passed place to be sent on POST/PUT requests.
   *
   * @param organization
   * @param collection
   *
   * @returns {*}
   */
  toPayload(organization: OrganizationType, collection: string = 'organization_names'): any {
    return super.toPayload(organization, collection);
  }
}

const OrganizationNamesTransform: OrganizationNames = new OrganizationNames();
export default OrganizationNamesTransform;
