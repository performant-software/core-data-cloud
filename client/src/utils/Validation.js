// @flow

import _ from 'underscore';

type DeleteErrorType = {
  response: {
    data: {
      errors: Array<{ [key: string]: string}>
    }
  }
};

/**
 * Resolves a delete error.
 *
 * @param data
 *
 * @returns {[]}
 */
const resolveDeleteError = ({ response: { data } }: DeleteErrorType): Array<string> => {
  const errors = [];

  _.each(data.errors, (error) => {
    _.each(_.keys(error), (key) => {
      errors.push(error[key]);
    });
  });

  return errors;
};

type UpdateErrorType = {
  [key: string]: string
};

/**
 * Resolves an update error.
 *
 * @param key
 * @param error
 *
 * @returns {{}}
 */
const resolveUpdateError = ({ key, error }: UpdateErrorType): any => ({ [key]: error });

export default {
  resolveDeleteError,
  resolveUpdateError
};
