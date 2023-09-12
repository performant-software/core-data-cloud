// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import OwnableDropdown from '../components/OwnableDropdown';
import PeopleService from '../services/People';
import type { Person as PersonType } from '../types/Place';
import PersonNameModal from '../components/PersonNameModal';
import styles from './Person.module.css';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PersonType
};

const PlaceForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SimpleEditPage
      {...props}
      className={styles.person}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Form.Input
          label={t('Common.labels.project')}
          required
        >
          <OwnableDropdown
            item={props.item}
            onSetState={props.onSetState}
          />
        </Form.Input>
        <Header
          content={t('Person.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          className={styles.names}
          columns={[{
            name: 'last_name',
            label: t('Person.personNames.columns.lastName')
          }, {
            name: 'first_name',
            label: t('Person.personNames.columns.firstName')
          }, {
            name: 'primary',
            label: t('Person.personNames.columns.primary'),
            render: (personName) => <BooleanIcon value={personName.primary} />
          }]}
          items={props.item.person_names}
          modal={{
            component: PersonNameModal
          }}
          onSave={props.onSaveChildAssociation.bind(this, 'person_names')}
          onDelete={props.onDeleteChildAssociation.bind(this, 'person_names')}
        />
        <Form.TextArea
          error={props.isError('biography')}
          label={t('Person.labels.biography')}
          onChange={props.onTextInputChange.bind(this, 'biography')}
          required={props.isRequired('biography')}
          value={props.item.biography}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Person: AbstractComponent<any> = withReactRouterEditPage(PlaceForm, {
  id: 'personId',
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
