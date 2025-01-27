// @flow

const SSO_DOMAINS = process.env.REACT_APP_SSO_DOMAINS
  ? process.env.REACT_APP_SSO_DOMAINS.split(',')
  : [];

const showPasswordFields = (email: string) => {
  if (email) {
    return !SSO_DOMAINS.some((domain) => email.endsWith(domain));
  }

  return true;
};

export default {
  showPasswordFields
};
