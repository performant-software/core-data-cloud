// @flow

import _ from 'underscore';
import type { Person as PersonType } from '../types/Person';

const NAME_SEPARATOR = ' ';

/**
 * Returns the concatenated name for the passed person.
 *
 * @param person
 *
 * @returns {*}
 */
const getNameView = (person: PersonType) => {
  let names;

  if (person) {
    const primary = _.findWhere(person.person_names, { primary: true });

    if (primary) {
      names = [primary.first_name, primary.middle_name, primary.last_name];
    } else {
      names = [person.first_name, person.middle_name, person.last_name];
    }
  }

  return _.compact(names).join(NAME_SEPARATOR);
};

export default {
  getNameView
};
