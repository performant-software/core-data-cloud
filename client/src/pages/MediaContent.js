// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import MediaContentForm from '../components/MediaContentForm';
import MediaContentsService from '../services/MediaContents';

const MediaContent = () => (
  <ItemPage
    form={MediaContentForm}
    onInitialize={(id) => (
      MediaContentsService
        .fetchOne(id)
        .then(({ data }) => data.media_content)
    )}
    onSave={(mediaContent) => (
      MediaContentsService
        .save(mediaContent)
        .then(({ data }) => data.media_content)
    )}
  />
);

export default MediaContent;
