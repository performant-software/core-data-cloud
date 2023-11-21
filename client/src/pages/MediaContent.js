// @flow

import { LazyIIIF, SimpleEditPage } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import initialize from '../hooks/Item';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaContentsService from '../services/MediaContents';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import useParams from '../hooks/ParsedParams';
import { useTranslation } from 'react-i18next';

type Props = EditContainerProps & {
  item: MediaContentType
};

const MediaContentPage = (props: Props) => {
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => IIIFUtils.createManifestURL(props.item.manifest), [props.item.manifest]);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
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
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelId}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::MediaContent'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const MediaContent = withReactRouterEditPage(MediaContentPage, {
  id: 'itemId',
  onInitialize: (id) => (
    MediaContentsService
      .fetchOne(id)
      .then(({ data }) => data.media_content)
  ),
  onSave: (mediaContent) => (
    MediaContentsService
      .save(mediaContent)
      .then(({ data }) => data.media_content)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default MediaContent;
