// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationNameModal from './OrganizationNameModal';

type Props = EditContainerProps & {
  item: OrganizationType
};

const OrganizationForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Header
        content={t('OrganizationForm.labels.names')}
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
          name: 'name',
          label: t('OrganizationForm.organizationNames.columns.name')
        }, {
          name: 'primary',
          label: t('OrganizationForm.organizationNames.columns.primary'),
          render: (organizationName) => <BooleanIcon value={organizationName.primary} />
        }]}
        configurable={false}
        items={props.item.organization_names}
        modal={{
          component: OrganizationNameModal
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'organization_names')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'organization_names')}
      />
      <Form.TextArea
        error={props.isError('description')}
        label={t('OrganizationForm.labels.description')}
        onChange={props.onTextInputChange.bind(this, 'description')}
        required={props.isRequired('description')}
        value={props.item.description}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Organization'
        />
      )}
    </Form>
  );
};

export default OrganizationForm;
