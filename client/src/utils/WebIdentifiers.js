// @flow

import WebAuthorityUtils from './WebAuthorities';

const BNF_BASE_URL = 'https://catalogue.bnf.fr';
const DPLA_BASE_URL = 'https://dp.la/item';
const JISC_BASE_URL = 'https://discover.libraryhub.jisc.ac.uk/search?id=';
const VIAF_BASE_URL = 'http://viaf.org/viaf';
const WIKIDATA_BASE_URL = 'https://www.wikidata.org/wiki';

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
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.dpla) {
    url = `${DPLA_BASE_URL}/${identifier.identifier}`;
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.jisc) {
    url = `${JISC_BASE_URL}${identifier.identifier}`;
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.viaf) {
    url = `${VIAF_BASE_URL}/${identifier.identifier}`;
  } else if (authority.source_type === WebAuthorityUtils.SourceTypes.wikidata) {
    url = `${WIKIDATA_BASE_URL}/${identifier.identifier}`;
  }

  return url;
};

export default {
  getURL
};
