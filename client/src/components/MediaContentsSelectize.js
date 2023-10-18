// @flow

import { Selectize, SelectizeImageHeader } from '@performant-software/semantic-components';
import React, { useCallback } from 'react';
import { Card } from 'semantic-ui-react';
import _ from 'underscore';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaContentsService from '../services/MediaContents';
import useParams from '../hooks/ParsedParams';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void,
  onSave: (items: Array<MediaContentType>) => Promise<any>
};

const MediaContentsSelectize = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  const onLoad = useCallback((params) => (
    MediaContentsService.fetchAll({
      ...params,
      per_page: 5,
      sort_by: 'name',
      project_id: projectId
    })
  ), [projectId]);

  return (
    <Selectize
      collectionName='media_contents'
      onClose={props.onClose}
      onLoad={onLoad}
      onSave={props.onSave}
      renderHeader={({ onItemClick, selectedItem, selectedItems }) => (
        <SelectizeImageHeader
          isSelected={(item) => item === selectedItem}
          items={selectedItems}
          onItemClick={onItemClick}
          renderImage={(item) => item.content_thumbnail_url}
          renderHeader={(item) => item.name}
          selectedItem={selectedItem}
          selectedItems={selectedItems}
        />
      )}
      renderItems={({ isSelected, items: innerItems, onSelect }) => (
        <Card.Group
          itemsPerRow={5}
          link
        >
          { _.map(innerItems, (item) => (
            <Card
              color={isSelected(item) ? 'green' : undefined}
              image={item.content_thumbnail_url}
              header={item.name}
              onClick={() => onSelect(item)}
            />
          ))}
        </Card.Group>
      )}
      title={t('MediaContentsSelectize.title')}
      width='60%'
    />
  );
};

export default MediaContentsSelectize;
