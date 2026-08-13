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
    onLoadVersions={(id, params) => (
      InstancesService
        .getVersions(id, params)
    )}
    onPublish={(id, published) => (
      InstancesService
        .publish(id, published)
    )}
    onSave={(instance) => (
      InstancesService
        .save(instance)
        .then(({ data }) => data.instance)
    )}
  />
);

export default Instance;
