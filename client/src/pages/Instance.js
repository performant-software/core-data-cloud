// @flow

import React from 'react';
import InstanceForm from '../components/InstanceForm';
import InstancesService from '../services/Instances';
import ItemPage from '../components/ItemPage';

const Instance = () => (
  <ItemPage
    form={InstanceForm}
    onCreateManifests={(id, params) => (
      InstancesService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      InstancesService
        .fetchOne(id)
        .then(({ data }) => data.instance)
    )}
    onSave={(instance) => (
      InstancesService
        .save(instance)
        .then(({ data }) => data.instance)
    )}
  />
);

export default Instance;
