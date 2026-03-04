// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import type { User as UserType } from '../types/User';

const PASSWORD_FORMAT = /(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])/;

const SSO_DOMAINS = import.meta.env.VITE_SSO_DOMAINS
  ? import.meta.env.VITE_SSO_DOMAINS.split(',')
  : [];

/**
 * Returns `true` if the pass email matches any of the SSO domains.
 *
 * @param email
 *
 * @returns {*}
 */
const isSingleSignOn = (email: string) => _.some(SSO_DOMAINS, (domain) => email?.endsWith(domain));

/**
 * Validates the password for the passed user.
 *
 * @param user
 *
 * @returns {null|{password: *}}
 */
const validatePassword = (user: UserType) => {
  // Password must match confirmation
  if (user.password !== user.password_confirmation) {
    return { password: i18n.t('User.errors.password.match') };
  }

  // Password must match format
  if (!user.password.match(PASSWORD_FORMAT)) {
    return { password: i18n.t('User.errors.password.format') };
  }

  return null;
};

/**
 * Validates individual requirements for the passed password.
 *
 * @param password
 *
 * @returns {*}
 */
const validatePasswordGranular = (password) => ({
  len: password.length >= 8,
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
  symbol: /[^a-zA-Z0-9\s]/.test(password),
  upper: /[A-Z]/.test(password)
});

export default {
  isSingleSignOn,
  validatePassword,
  validatePasswordGranular
};
