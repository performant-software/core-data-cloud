// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import type { Person as PersonType } from '../types/Person';
import PersonNameModal from './PersonNameModal';

type Props = EditContainerProps & {
  item: PersonType
};

const PersonForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Header
        content={t('PersonForm.labels.names')}
        size='tiny'
      />
      <EmbeddedList
        actions={[{
          name: 'edit',
          icon: 'pencil'
        }, {
          name: 'delete',
          icon: 'times'
        }]}
        addButton={{
          basic: false,
          color: 'dark gray',
          content: t('Common.buttons.addName'),
          location: 'bottom'
        }}
        className='compact'
        columns={[{
          name: 'last_name',
          label: t('PersonForm.personNames.columns.lastName')
        }, {
          name: 'first_name',
          label: t('PersonForm.personNames.columns.firstName')
        }, {
          name: 'primary',
          label: t('PersonForm.personNames.columns.primary'),
          render: (personName) => <BooleanIcon value={personName.primary} />
        }]}
        configurable={false}
        items={props.item.person_names}
        modal={{
          component: PersonNameModal
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'person_names')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'person_names')}
      />
      <Form.TextArea
        error={props.isError('biography')}
        label={t('PersonForm.labels.biography')}
        onChange={props.onTextInputChange.bind(this, 'biography')}
        required={props.isRequired('biography')}
        value={props.item.biography}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Person'
        />
      )}
    </Form>
  );
};

export default PersonForm;
