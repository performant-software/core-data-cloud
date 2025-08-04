// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';

type JobTypesType = {
  [key: string]: {
    label: string,
    value: string
  }
};

const JobTypes: JobTypesType = {
  export: {
    label: i18n.t('JobTypes.labels.export'),
    value: 'export'
  },
  import: {
    label: i18n.t('JobTypes.labels.import'),
    value: 'import'
  }
};

/**
 * Returns the label for the passed role value.
 *
 * @param value
 *
 * @returns {*}
 */
const getTypeView = (value: string): string => {
  const type = _.findWhere(_.values(JobTypes), { value });
  return type?.label;
};

export {
  getTypeView,
  JobTypes
};
