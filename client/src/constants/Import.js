// @flow

const DefaultSort = {
  'events.csv': 'name',
  'instances.csv': 'name',
  'items.csv': 'name',
  'organizations.csv': 'name',
  'people.csv': 'last_name',
  'places.csv': 'name',
  'taxonomies.csv': 'name',
  'works.csv': 'name'
};

const Status = {
  new: 'new',
  noConflict: 'noConflict',
  conflict: 'conflict',
  resolved: 'resolved'
};

export default { };

export {
  DefaultSort,
  Status
};
