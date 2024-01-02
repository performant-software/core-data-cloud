// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import WorksService from '../services/Works';
import type { Work as WorkType } from '../types/Work';
import WorkForm from '../components/WorkForm';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: WorkType
};

const WorkPage = (props: Props) => {
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
        <WorkForm
          {...props}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Work: AbstractComponent<any> = withReactRouterEditPage(WorkPage, {
  id: 'itemId',
  onInitialize: (id) => (
    WorksService
      .fetchOne(id)
      .then(({ data }) => data.work)
  ),
  onSave: (work) => (
    WorksService
      .save(work)
      .then(({ data }) => data.work)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Work;
