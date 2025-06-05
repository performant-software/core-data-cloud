// @flow

import _ from 'underscore';

const SSO_DOMAINS = process.env.REACT_APP_SSO_DOMAINS
  ? process.env.REACT_APP_SSO_DOMAINS.split(',')
  : [];

/**
 * Returns `true` if the pass email matches any of the SSO domains.
 *
 * @param email
 *
 * @returns {*}
 */
const isSingleSignOn = (email: string) => _.some(SSO_DOMAINS, (domain) => email?.endsWith(domain));

export default {
  isSingleSignOn
};
