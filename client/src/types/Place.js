// @flow

import type { Projectable } from './Projectable';

export type PlaceName = {
  id: number,
  name: string,
  primary: boolean
};

export type Place = Projectable & {
  id: number,
  name: string,
  place_names: Array<PlaceName>
};
