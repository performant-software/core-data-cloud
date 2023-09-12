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
  let nameView;

  const primary = _.findWhere(person.person_names, { primary: true });

  if (primary) {
    const names = [primary.first_name, primary.middle_name, primary.last_name];
    nameView = _.compact(names).join(NAME_SEPARATOR);
  }

  return nameView;
};

export default {
  getNameView
};
