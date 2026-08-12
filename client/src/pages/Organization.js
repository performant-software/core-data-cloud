// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import OrganizationForm from '../components/OrganizationForm';
import OrganizationService from '../services/Organizations';

const Organization = () => (
  <ItemPage
    form={OrganizationForm}
    onCreateManifests={(id, params) => (
      OrganizationService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      OrganizationService
        .fetchOne(id)
        .then(({ data }) => data.organization)
    )}
    onLoadVersions={(id, params) => (
      OrganizationService
        .getVersions(id, params)
    )}
    onPublish={(id, published) => (
      OrganizationService
        .publish(id, published)
    )}
    onSave={(organization) => (
      OrganizationService
        .save(organization)
        .then(({ data }) => data.organization)
    )}
  />
);

export default Organization;
