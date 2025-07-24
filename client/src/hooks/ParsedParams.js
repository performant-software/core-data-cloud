// @flow

import { useParams as useDefaultParams } from 'react-router';
import _ from 'underscore';

type ParamsType = {
  projectId?: number,
  userId?: number,
  userProjectId?: number
};

const KEY_ID = 'Id';

/**
 * Returns the URL parameters object with the ID values parsed into integers.
 *
 * @returns {{}}
 */
const useParams = (): ParamsType => {
  const params = {};

  const defaultParams = useDefaultParams();
  _.each(_.keys(defaultParams), (key) => {
    let value = defaultParams[key];

    if (key.includes(KEY_ID)) {
      value = parseInt(value, 10);
    }

    params[key] = value;
  });

  return params;
};

export default useParams;
