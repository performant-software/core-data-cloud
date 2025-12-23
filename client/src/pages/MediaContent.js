// @flow

import React, { useContext } from 'react';
import ItemPage from '../components/ItemPage';
import MediaContentForm from '../components/MediaContentForm';
import MediaContentsService from '../services/MediaContents';
import ProjectContext from '../context/Project';

const MediaContent = () => {
  const { project } = useContext(ProjectContext);

  return (
    <ItemPage
      form={MediaContentForm}
      onCreateManifests={(id, params) => (
        MediaContentsService
          .createManifests(id, params)
      )}
      onInitialize={(id) => (
        MediaContentsService
          .fetchOne(id)
          .then(({ data }) => data.media_content)
      )}
      onSave={(mediaContent) => (
        MediaContentsService
          .uploadOne(mediaContent, project)
          .then(({ data }) => data.media_content)
      )}
    />
  );
};

export default MediaContent;
