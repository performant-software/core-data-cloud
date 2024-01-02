// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import InstancesService from '../services/Instances';
import type { Instance as InstanceType } from '../types/Instance';
import InstanceForm from '../components/InstanceForm';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: InstanceType
};

const InstancePage = (props: Props) => {
  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <InstanceForm
          {...props}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Instance: AbstractComponent<any> = withReactRouterEditPage(InstancePage, {
  id: 'itemId',
  onInitialize: (id) => (
    InstancesService
      .fetchOne(id)
      .then(({ data }) => data.instance)
  ),
  onSave: (instance) => (
    InstancesService
      .save(instance)
      .then(({ data }) => data.instance)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Instance;
