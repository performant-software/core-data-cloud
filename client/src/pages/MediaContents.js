// @flow

import { ItemList, LazyMedia } from '@performant-software/semantic-components';
import React, { useCallback, useContext, useState } from 'react';
import { FaImage, FaImages } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import MediaContentsService from '../services/MediaContents';
import MergeButton from '../components/MergeButton';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import useSelectable from '../hooks/Selectable';
import { useTranslation } from 'react-i18next';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const MediaContents = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();

  /**
   * Renders the preview image for the passed media content record.
   *
   * @type {unknown}
   */
  const resolveMediaContent = useCallback((mediaContent) => mediaContent.content_thumbnail_url && (
    <LazyMedia
      contentType={mediaContent.content_type}
      dimmable={false}
      preview={mediaContent.content_thumbnail_url}
      src={mediaContent.content_thumbnail_url}
      size='tiny'
    />
  ), []);

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
        buttons={[{
          render: () => (
            <MergeButton
              attributes={[{
                name: 'uuid',
                label: t('Common.actions.merge.uuid'),
              }, {
                name: 'content',
                label: t('MediaContents.actions.merge.content'),
                onRemove: () => ({
                  content: null,
                  content_thumbnail_url: null,
                  content_type: null
                }),
                onSelection: (mediaContent) => ({
                  content_url: mediaContent.content_url,
                  content_thumbnail_url: mediaContent.content_thumbnail_url,
                  content_type: mediaContent.content_type
                }),
                resolve: resolveMediaContent
              }, {
                name: 'name',
                label: t('MediaContents.actions.merge.name')
              }]}
              ids={selectedItems}
              onLoad={(id) => (
                MediaContentsService
                  .fetchOne(id)
                  .then(({ data }) => data.media_content)
              )}
              onSave={(mediaContent) => (
                MediaContentsService
                  .mergeRecords(mediaContent, selectedItems)
                  .then(({ data }) => data.media_content)
              )}
              projectModelId={projectModelId}
              title={t('MediaContents.actions.merge.title')}
            />
          )
        }]}
        collectionName='media_contents'
        isRowSelected={isSelected}
        key={view}
        onLoad={(params) => (
          MediaContentsService
            .fetchAll({
              ...params,
              project_model_id: projectModelId,
              defineable_id: projectModelId,
              defineable_type: 'CoreDataConnector::ProjectModel',
              view
            })
            .finally(() => WindowUtils.scrollToTop())
        )}
        onDelete={(mediaContent) => MediaContentsService.delete(mediaContent)}
        onRowSelect={onRowSelect}
        perPageOptions={[10, 25, 50, 100]}
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
        selectable
        session={{
          key: `media_contents_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default MediaContents;
