// @flow

import { LazyIIIF, SimpleEditPage } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import CurrentRecord from '../context/CurrentRecord';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaContentsService from '../services/MediaContents';
import Validation from '../utils/Validation';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: MediaContentType
};

const MediaContentForm = (props: Props) => {
  const { setCurrentRecord } = useContext(CurrentRecord);
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
  useEffect(() => setCurrentRecord(props.item, Types.MediaContent), [props.item]);

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
        key='details'
        name={t('Common.tabs.details')}
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
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const MediaContent = withReactRouterEditPage(MediaContentForm, {
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
