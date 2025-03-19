// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import type { WebAuthority as WebAuthorityType } from '../types/WebAuthority';

const ERROR_KEY_API_KEY = 'access.api_key';
const ERROR_KEY_URL = 'access.url';
const ERROR_KEY_USERNAME = 'access.username';

const SourceTypes = {
  atom: 'atom',
  bnf: 'bnf',
  dpla: 'dpla',
  geonames: 'geonames',
  jisc: 'jisc',
  viaf: 'viaf',
  wikidata: 'wikidata'
};

const SourceTypeLabels = {
  [SourceTypes.atom]: i18n.t('WebAuthorities.labels.atom'),
  [SourceTypes.bnf]: i18n.t('WebAuthorities.labels.bnf'),
  [SourceTypes.dpla]: i18n.t('WebAuthorities.labels.dpla'),
  [SourceTypes.geonames]: i18n.t('WebAuthorities.labels.geonames'),
  [SourceTypes.jisc]: i18n.t('WebAuthorities.labels.jisc'),
  [SourceTypes.viaf]: i18n.t('WebAuthorities.labels.viaf'),
  [SourceTypes.wikidata]: i18n.t('WebAuthorities.labels.wikidata')
};

/**
 * Returns the source type "view" for the passed web authority.
 *
 * @param authority
 *
 * @returns {*}
 */
const getSourceView = (authority: WebAuthorityType) => SourceTypeLabels[authority?.source_type];

/**
 * Returns the list of available source types.
 *
 * @returns {*}
 */
const getSourceTypeOptions = () => _.map(_.keys(SourceTypeLabels), (key) => ({
  key,
  value: key,
  text: SourceTypeLabels[key]
}));

/**
 * Validates the passed web authority.
 *
 * @param authority
 *
 * @returns {{}}
 */
const validate = (authority: WebAuthorityType) => {
  const errors = {};

  if (authority.source_type === SourceTypes.atom) {
    if (_.isEmpty(authority.access?.url)) {
      _.extend(errors, { [ERROR_KEY_URL]: i18n.t('Common.errors.required', { name: ERROR_KEY_URL }) });
    }

    if (_.isEmpty(authority.access?.api_key)) {
      _.extend(errors, { [ERROR_KEY_API_KEY]: i18n.t('Common.errors.required', { name: ERROR_KEY_API_KEY }) });
    }
  }

  if (authority.source_type === SourceTypes.geonames) {
    if (_.isEmpty(authority.access?.username)) {
      _.extend(errors, { [ERROR_KEY_USERNAME]: i18n.t('Common.errors.required', { name: ERROR_KEY_USERNAME }) });
    }
  }


  return errors;
};

export default {
  getSourceTypeOptions,
  getSourceView,
  SourceTypes,
  validate
};
