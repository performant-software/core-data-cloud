// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { Person as PersonType } from '../types/Person';

/**
 * Class responsible for transforming person names objects.
 */
class PersonNames extends NestedAttributesTransform {
  /**
   * Returns the person names payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'first_name',
      'middle_name',
      'last_name',
      'primary',
      '_destroy'
    ];
  }

  /**
   * Returns the person names for the passed place to be sent on POST/PUT requests.
   *
   * @param person
   * @param collection
   *
   * @returns {*}
   */
  toPayload(person: PersonType, collection: string = 'person_names'): any {
    return super.toPayload(person, collection);
  }
}

const PersonNamesTransform: PersonNames = new PersonNames();
export default PersonNamesTransform;
