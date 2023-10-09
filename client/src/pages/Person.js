// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { type AbstractComponent, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import CurrentRecordContext from '../context/CurrentRecord';
import PeopleService from '../services/People';
import type { Person as PersonType } from '../types/Place';
import PersonNameModal from '../components/PersonNameModal';
import styles from './Person.module.css';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PersonType
};

const PlaceForm = (props: Props) => {
  const { setCurrentRecord } = useContext(CurrentRecordContext);
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  /**
   * Sets the project model ID on the state from the route parameters.
   */
  useEffect(() => {
    if (!props.item.id) {
      props.onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, props.item.id]);

  /**
   * Sets the current record on the context.
   */
  useEffect(() => setCurrentRecord(props.item, Types.Person), [props.item]);

  return (
    <SimpleEditPage
      {...props}
      className={styles.person}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Header
          content={t('Person.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
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
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelId}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Person'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Person: AbstractComponent<any> = withReactRouterEditPage(PlaceForm, {
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
