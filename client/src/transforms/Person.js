// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Person as PersonType } from '../types/Place';
import PersonNames from './PersonNames';

/**
 * Class responsible for transforming person records for POST/PUT requests.
 */
class Person extends BaseTransform {
  /**
   * Returns the person parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'person';
  }

  /**
   * Returns the person payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_model_id',
      'biography'
    ];
  }

  /**
   * Returns the person for POST/PUT requests as a plain Javascript object.
   *
   * @param person
   *
   * @returns {*}
   */
  toPayload(person: PersonType): any {
    return super.toPayload(person, {
      ...PersonNames.toPayload(person)
    });
  }
}

const PersonTransform: Person = new Person();
export default PersonTransform;
