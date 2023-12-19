// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import PeopleService from '../services/People';
import type { Person as PersonType } from '../types/Place';
import PersonForm from '../components/PersonForm';
import Relationships from '../components/Relationships';
import SaveButton from '../components/SaveButton';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PersonType
};

const PersonPage = (props: Props) => {
  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  return (
    <>
      <PersonForm
        {...props}
      />
      <SaveButton
        onClick={props.onSave}
      />
      <Relationships />
    </>
  );
};

const Person: AbstractComponent<any> = withReactRouterEditPage(PersonPage, {
  id: 'itemId',
  onInitialize: (id) => (
    PeopleService
      .fetchOne(id)
      .then(({ data }) => data.person)
  ),
  onSave: (person) => (
    PeopleService
      .save(person)
      .then(({ data }) => data.person)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Person;
