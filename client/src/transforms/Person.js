// @flow

import { BaseTransform } from '@performant-software/shared-components';
import _ from 'underscore';
import type { Person as PersonType } from '../types/Person';
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
      'biography',
      'user_defined'
    ];
  }

  /**
   * Returns the passed person as a dropdown option.
   *
   * @param person
   *
   * @returns {{text: *, value: *, key: *}}
   */
  toDropdown(person: PersonType) {
    return {
      key: person.id,
      value: person.id,
      text: _.compact([person.first_name, person.middle_name, person.last_name]).join(' ')
    };
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
