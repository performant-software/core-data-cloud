// @flow

import WebAuthorityUtils from './WebAuthorities';

const WIKIDATA_BASE_URL = 'https://www.wikidata.org/wiki';
const BNF_BASE_URL = 'https://catalogue.bnf.fr';

/**
 * Returns the webpage URL for the passed web identifier.
 *
 * @param identifier
 *
 * @returns {*}
 */
const getURL = (identifier) => {
  let url;

  const { web_authority: authority } = identifier;

  if (authority.source_type === WebAuthorityUtils.SourceTypes.atom) {
    url = `${authority.access.url}/${identifier.identifier}`;
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.bnf) {
    url = `${BNF_BASE_URL}/${identifier.identifier}`;
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.wikidata) {
    url = `${WIKIDATA_BASE_URL}/${identifier.identifier}`;
  }

  return url;
};

export default {
  getURL
};
