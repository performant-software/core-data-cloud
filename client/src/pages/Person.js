// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import PeopleService from '../services/People';
import PersonForm from '../components/PersonForm';

const Person = () => (
  <ItemPage
    form={PersonForm}
    onInitialize={(id) => (
      PeopleService
        .fetchOne(id)
        .then(({ data }) => data.person)
    )}
    onSave={(person) => (
      PeopleService
        .save(person)
        .then(({ data }) => data.person)
    )}
  />
);

export default Person;
