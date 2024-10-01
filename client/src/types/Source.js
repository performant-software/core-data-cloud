// @flow

export type SourceName = {
  id: number,
  primary: number,
  nameable_type: 'CoreDataConnector::Instance' | 'CoreDataConnector::Item' | 'CoreDataConnector::Work',
  nameable_id: number,
  name: string,
  project_id: number
};

export type Source = {
  id: number,
  name: string,
  primary_name: SourceName,
  source_names: Array<SourceName>
};
