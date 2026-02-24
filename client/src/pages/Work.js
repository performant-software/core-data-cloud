// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import WorkForm from '../components/WorkForm';
import WorksService from '../services/Works';

const Work = () => (
  <ItemPage
    form={WorkForm}
    onCreateManifests={(id, params) => (
      WorksService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      WorksService
        .fetchOne(id)
        .then(({ data }) => data.work)
    )}
    onSave={(work) => (
      WorksService
        .save(work)
        .then(({ data }) => data.work)
    )}
  />
);

export default Work;
