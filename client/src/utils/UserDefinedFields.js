// @flow

import _ from 'underscore';

const USER_DEFINED_REGEX = /(user_defined\[)(.+)(\])/g;

/**
 * Parses the `uuid` value from the passed field name/key.
 *
 * @param key
 */
const parseUuid = (key) => _.first(Array.from(key.matchAll(USER_DEFINED_REGEX)))[2];

export default {
  parseUuid
};
