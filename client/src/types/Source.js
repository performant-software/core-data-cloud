// @flow

import type { Name } from './Name';

export type SourceTitle = {
  id: number,
  primary: number,
  nameable_type: 'CoreDataConnector::Instance'
    | 'CoreDataConnector::Item'
    | 'CoreDataConnector::Work',
  nameable_id: number,
  name: Name,
  project_id: number
}

export type Source = {
  id: number,
  source_titles: SourceTitle[],
  primary_name: SourceTitle
}
