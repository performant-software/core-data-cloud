// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import Validation from './Validation';

const ERROR_INVALID_TYPE = 'is not included in the list';
const KEY_MODEL_CLASS = 'model_class';

const Types = {
  MediaContent: 'Media Content',
  Organization: 'Organization',
  Person: 'Person',
  Place: 'Place'
};

/**
 * Resolves the project models validation errors.
 *
 * @param key
 * @param error
 * @param item
 *
 * @returns {{}}
 */
const resolveValidationError = ({ key, error, item }) => {
  const errors = {};

  if (key === KEY_MODEL_CLASS && error === ERROR_INVALID_TYPE) {
    errors[key] = i18n.t('ProjectModel.errors.invalidType', { type: item.model_class });
  } else {
    _.extend(errors, Validation.resolveUpdateError({ key, error }));
  }

  return errors;
};

export default {
  resolveValidationError,
};

export {
  Types
};
