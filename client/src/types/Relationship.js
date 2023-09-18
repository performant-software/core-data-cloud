// @flow

import type { Organization } from './Organization';
import type { Person } from './Person';
import type { Place } from './Place';

export type Relationship = {
  id: number,
  primary_record_id: number,
  primary_record_type: string,
  primary_record: Organization | Person | Place,
  related_record_id: number,
  related_record_type: string,
  related_record: Organization | Person | Place
};
