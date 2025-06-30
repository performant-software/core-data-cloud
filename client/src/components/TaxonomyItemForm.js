// @flow

import type { EditContainerProps } from '@performant-software/shared-components';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { Taxonomy as TaxonomyType } from '../types/Taxonomy';

type Props = EditContainerProps & {
  item: TaxonomyType
};

const TaxonomyItemForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Form.Input
        autoFocus
        error={props.isError('name')}
        label={t('TaxonomyItems.labels.name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        required={props.isRequired('name')}
        value={props.item.name || 0}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Taxonomy'
        />
      )}
    </Form>
  );
};

export default TaxonomyItemForm;
