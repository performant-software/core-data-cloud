// @flow

import { LazyIIIF } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { MediaContent as MediaContentType } from '../types/MediaContent';

type Props = EditContainerProps & {
  item: MediaContentType
};

const MediaContentForm = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => IIIFUtils.createManifestURL(props.item.manifest), [props.item.manifest]);

  return (
    <Form>
      <Form.Input
        label={t('MediaContent.labels.content')}
      >
        <LazyIIIF
          color='teal'
          contentType={props.item.content_type}
          downloadUrl={props.item.content_download_url}
          manifest={manifest}
          onUpload={(file) => props.onSetState({
            name: file.name,
            content: file
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
