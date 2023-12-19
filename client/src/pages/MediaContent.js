// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import SaveButton from '../components/SaveButton';
import initialize from '../hooks/Item';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaContentForm from '../components/MediaContentForm';
import MediaContentsService from '../services/MediaContents';
import Relationships from '../components/Relationships';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: MediaContentType
};

const MediaContentPage = (props: Props) => {
  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  return (
    <>
      <MediaContentForm
        {...props}
      />
      <SaveButton
        onClick={props.onSave}
      />
      <Relationships />
    </>
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
