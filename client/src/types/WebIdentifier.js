// @flow

import type { WebAuthority as WebAuthorityType } from './WebAuthority';

export type WebIdentifier = {
  id: number,
  web_authority_id: number,
  web_authority: WebAuthorityType,
  identifiable_id: number,
  identifiable_type: string,
  identifier: string
};
