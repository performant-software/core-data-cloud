// @flow

import { LazyIIIF } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaUploadingMessage from './MediaUploadingMessage';

type Props = EditContainerProps & {
  item: MediaContentType
};

const MediaContentForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form
      warning={props.item.content_changed}
    >
      { props.saved && (
        <MediaUploadingMessage />
      )}
      <Message
        content={t('MediaContentForm.messages.upload.content')}
        header={t('MediaContentForm.messages.upload.header')}
        icon='warning sign'
        warning
      />
      <Form.Input
        label={t('MediaContent.labels.content')}
      >
        <LazyIIIF
          color='teal'
          contentType={props.item.content_type}
          downloadUrl={props.item.content_download_url}
          manifest={props.item.manifest_url}
          onUpload={(file) => props.onSetState({
            name: file.name,
            content: file,
            content_changed: true
          })}
          preview={props.item.content_preview_url}
          src={props.item.content_url}
        />
      </Form.Input>
      <Form.Input
        error={props.isError('name')}
        label={t('MediaContent.labels.name')}
        required={props.isRequired('name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        value={props.item.name}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::MediaContent'
        />
      )}
    </Form>
  );
};

export default MediaContentForm;
