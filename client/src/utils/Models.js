// @flow

export const getSystemColumns = (model: string, t: any) => {
  return systemColumns[model].map(column => ({
    ...column,
    label: t(column.label)
  }));
};

export const systemColumns = {
  events: [
  // todo: dates
  {
    name: 'name',
    label: 'Events.columns.startDate'
  }],
  instances: [{
    name: 'name',
    label: 'Instances.columns.name'
  }],
  items: [{
    name: 'name',
    label: 'Items.columns.name'
  }],
  mediaContents: [{
    name: 'name',
    label: 'MediaContents.columns.name'
  }],
  organizations: [{
    name: 'name',
    label: 'Organizations.columns.name'
  }],
  people: [{
    name: 'last_name',
    label: 'People.columns.lastName'
  }, {
    name: 'first_name',
    label: 'People.columns.firstName'
  }],
  places: [{
    name: 'name',
    label: 'Places.columns.name'
  }],
  taxonomies: [{
    name: 'name',
    label: 'Taxonomies.columns.name'
  }]
};
