// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import PlaceForm from '../components/PlaceForm';
import PlacesService from '../services/Places';

const Place = () => (
  <ItemPage
    form={PlaceForm}
    onCreateManifests={(id, params) => (
      PlacesService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      PlacesService
        .fetchOne(id)
        .then(({ data }) => data.place)
    )}
    onSave={(place) => (
      PlacesService
        .save(place)
        .then(({ data }) => data.place)
    )}
  />
);

export default Place;
