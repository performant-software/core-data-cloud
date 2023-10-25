// @flow

import { ItemList, LazyMedia } from '@performant-software/semantic-components';
import React from 'react';
import MediaContentsService from '../services/MediaContents';
import { useNavigate } from 'react-router-dom';
import useParams from '../hooks/ParsedParams';

const MediaContents = () => {
  const navigate = useNavigate();
  const { projectModelId } = useParams();

  return (
    <ItemList
      actions={[{
        basic: false,
        name: 'edit',
        onClick: (item) => navigate(`${item.id}`)
      }, {
        basic: false,
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='media_contents'
      onLoad={(params) => MediaContentsService.fetchAll({ ...params, project_model_id: projectModelId })}
      onDelete={(mediaContent) => MediaContentsService.delete(mediaContent)}
      renderEmptyList={() => null}
      renderHeader={(mediaContent) => mediaContent.name}
      renderImage={(mediaContent) => (
        <LazyMedia
          dimmable={false}
          contentType={mediaContent.content_type}
          preview={mediaContent.content_thumbnail_url}
        />
      )}
      renderMeta={() => ''}
    />
  );
};

export default MediaContents;
