// @flow

/**
 * Returns true if the passed string can be parsed into an integer value.
 *
 * @param num
 *
 * @returns {boolean}
 */
const isInteger = (num: string) => /^-?[0-9]+$/.test(`${num}`);

export default {
  isInteger
};
