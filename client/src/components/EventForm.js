// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { Event as EventType } from '../types/Event';

type Props = EditContainerProps & {
  item: EventType
};

const EventForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Form.Input
        autoFocus
        error={props.isError('name')}
        label={t('EventForm.labels.name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        required={props.isRequired('name')}
        value={props.item.name}
      />
      <Form.TextArea
        error={props.isError('description')}
        label={t('EventForm.labels.description')}
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
          tableName='CoreDataConnector::Event'
        />
      )}
    </Form>
  );
};

export default EventForm;
