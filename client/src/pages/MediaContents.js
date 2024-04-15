// @flow

import { ItemList, LazyMedia } from '@performant-software/semantic-components';
import React, { useContext, useState } from 'react';
import { FaImage, FaImages } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import MediaContentsService from '../services/MediaContents';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';

const MediaContents = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();

  return (
    <>
      <ListViewMenu
        icons={{
          all: (
            <Icon>
              <FaImages />
            </Icon>
          ),
          owned: (
            <Icon>
              <FaImage />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ItemList
        actions={[{
          basic: false,
          name: 'edit',
          onClick: (mediaContent) => navigate(`${mediaContent.id}`)
        }, {
          accept: (mediaContent) => PermissionsService.canDeleteRecord(projectModel, mediaContent),
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
        key={view}
        onLoad={(params) => MediaContentsService.fetchAll({ ...params, project_model_id: projectModelId, view })}
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
    </>
  );
};

export default MediaContents;
