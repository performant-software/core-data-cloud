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
    onLoadVersions={(id, params) => (
      EventsService
        .getVersions(id, params)
    )}
    onPublish={(id, published) => (
      EventsService
        .publish(id, published)
    )}
    onSave={(event) => (
      EventsService
        .save(event)
        .then(({ data }) => data.event)
    )}
  />
);

export default Person;
