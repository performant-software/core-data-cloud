// @flow

import { FuzzyDate } from '@performant-software/semantic-components';
import { FuzzyDateTransform } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { Event as EventType } from '../types/Event';

type Props = EditContainerProps & {
  item: EventType
};

const EventForm = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Sets the new fuzzy date value on the state.
   *
   * @type {(function(*, *): void)|*}
   */
  const onFuzzyDateChange = useCallback((attribute, data) => {
    props.onSetState({
      [attribute]: {
        ...FuzzyDateTransform.toData(data),
        id: props.item[attribute]?.id,
        _destroy: !data.startDate
      }
    });
  }, [props.item]);

  return (
    <Form>
      <Form.Input
        autoFocus
        error={props.isError('name')}
        label={t('EventForm.labels.name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        required={props.isRequired('name')}
        value={props.item.name || ''}
      />
      <Form.TextArea
        error={props.isError('description')}
        label={t('EventForm.labels.description')}
        onChange={props.onTextInputChange.bind(this, 'description')}
        required={props.isRequired('description')}
        value={props.item.description || ''}
      />
      <Form.Input
        error={props.isError('start_date')}
        label={t('EventForm.labels.startDate')}
        required={props.isRequired('start_date')}
      >
        <FuzzyDate
          centered={false}
          date={FuzzyDateTransform.toFuzzyDate(props.item.start_date || {})}
          onChange={onFuzzyDateChange.bind(this, 'start_date')}
          title={t('EventForm.labels.startDate')}
        />
      </Form.Input>
      <Form.Input
        error={props.isError('end_date')}
        label={t('EventForm.labels.endDate')}
        required={props.isRequired('end_date')}
      >
        <FuzzyDate
          centered={false}
          date={FuzzyDateTransform.toFuzzyDate(props.item.end_date || {})}
          onChange={onFuzzyDateChange.bind(this, 'end_date')}
          title={t('EventForm.labels.endDate')}
        />
      </Form.Input>
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
