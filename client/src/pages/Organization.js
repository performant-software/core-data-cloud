// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationForm from '../components/OrganizationForm';
import OrganizationService from '../services/Organizations';
import Relationships from '../components/Relationships';
import SaveButton from '../components/SaveButton';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: OrganizationType
};

const OrganizationPage = (props: Props) => {
  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  return (
    <>
      <OrganizationForm
        {...props}
      />
      <SaveButton
        onClick={props.onSave}
      />
      <Relationships />
    </>
  );
};

const Organization: AbstractComponent<any> = withReactRouterEditPage(OrganizationPage, {
  id: 'itemId',
  onInitialize: (id) => (
    OrganizationService
      .fetchOne(id)
      .then(({ data }) => data.organization)
  ),
  onSave: (organization) => (
    OrganizationService
      .save(organization)
      .then(({ data }) => data.organization)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Organization;
