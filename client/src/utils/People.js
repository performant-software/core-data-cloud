// @flow

import _ from 'underscore';
import type { Person as PersonType, PersonName as PersonNameType } from '../types/Person';

const NAME_SEPARATOR = ' ';

/**
 * Returns the concatenated name for the passed person.
 *
 * @param person
 *
 * @returns {*}
 */
const getNameView = (person: PersonType) => {
  let name;

  if (person) {
    const primary = _.findWhere(person.person_names, { primary: true });

    if (primary) {
      name = formatName(primary);
    } else {
      name = formatName(person);
    }
  }

  return name;
};

/**
 * Formats the name for the passed person or person name type.
 *
 * @param name
 *
 * @returns {*}
 */
const formatName = (name: PersonType | PersonNameType) => {
  const names = [name.first_name, name.middle_name, name.last_name];
  return _.compact(names).join(NAME_SEPARATOR);
};

export default {
  formatName,
  getNameView
};
