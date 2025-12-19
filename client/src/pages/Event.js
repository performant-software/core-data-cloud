// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import EventForm from '../components/EventForm';
import EventsService from '../services/Events';

const Person = () => (
  <ItemPage
    form={EventForm}
    onCreateManifests={(id, params) => (
      EventsService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      EventsService
        .fetchOne(id)
        .then(({ data }) => data.event)
    )}
    onSave={(event) => (
      EventsService
        .save(event)
        .then(({ data }) => data.event)
    )}
  />
);

export default Person;
