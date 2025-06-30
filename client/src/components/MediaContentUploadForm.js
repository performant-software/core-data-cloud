// @flow

import { LazyMedia } from '@performant-software/semantic-components';
import type { FileUploadProps } from '@performant-software/semantic-components/types';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import {
  UserDefinedFieldsForm,
  type UserDefinedField as UserDefinedFieldType
} from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Item } from 'semantic-ui-react';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

type Props = EditContainerProps & FileUploadProps & {
  projectModelFields: Array<UserDefinedFieldType>,
  projectModelRelationshipFields: Array<UserDefinedFieldType>
};

const MediaContentUploadForm = (props: Props) => {
  const { foreignProjectModelId, projectModelRelationship } = useProjectModelRelationship();
  const { t } = useTranslation();

  return (
    <Item
      className='file-upload'
    >
      <Item.Image>
        <LazyMedia
          contentType={props.item.content_type}
          dimmable={false}
          src={props.item.content_url}
        />
      </Item.Image>
      <Item.Content>
        <Form.Input
          error={props.isError('name')}
          label={t('MediaContentUploadForm.labels.name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          required={props.isRequired('name')}
          value={props.item.name || ''}
        />
        { foreignProjectModelId && (
          <UserDefinedFieldsForm
            data={props.item.user_defined}
            defineableId={foreignProjectModelId}
            defineableType='CoreDataConnector::ProjectModel'
            fields={props.projectModelFields}
            isError={props.isError}
            onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
            onClearValidationError={props.onClearValidationError}
            required
            tableName='CoreDataConnector::MediaContent'
          />
        )}
        { projectModelRelationship && (
          <UserDefinedFieldsForm
            data={props.item.user_defined}
            defineableId={projectModelRelationship.id}
            defineableType='CoreDataConnector::ProjectModelRelationship'
            fields={props.projectModelRelationshipFields}
            isError={props.isError}
            onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
            onClearValidationError={props.onClearValidationError}
            required
            tableName='CoreDataConnector::Relationship'
          />
        )}
        <Button
          basic
          color='red'
          icon='trash'
          onClick={props.onDelete}
        />
        { props.renderStatus() }
      </Item.Content>
    </Item>
  );
};

export default MediaContentUploadForm;
