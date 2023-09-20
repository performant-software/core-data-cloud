// @flow

import { UserDefinedFields as UserDefinedFieldsUtils } from '@performant-software/user-defined-fields';
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
const resolveUpdateError = ({ key, error }: UpdateErrorType): any => {
  const errors = UserDefinedFieldsUtils.resolveError({ key, error });

  if (_.isEmpty(errors)) {
    _.extend(errors, { [key]: error });
  }

  return errors;
};

export default {
  resolveDeleteError,
  resolveUpdateError
};
