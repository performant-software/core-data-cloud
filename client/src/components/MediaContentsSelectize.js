// @flow

import { Selectize, SelectizeImageHeader } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';
import _ from 'underscore';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import MediaContentsService from '../services/MediaContents';
import ListViews from '../constants/ListViews';
import RelatedViewMenu from './RelatedViewMenu';
import styles from './MediaContentsSelectize.module.css';

type Props = {
  onClose: () => void,
  onSave: (items: Array<MediaContentType>) => Promise<any>,
  projectModelId: number
};

const MediaContentsSelectize = (props: Props) => {
  const [view, setView] = useState(ListViews.all);

  const { t } = useTranslation();

  const onLoad = useCallback((params) => (
    MediaContentsService.fetchAll({
      ...params,
      per_page: 5,
      sort_by: 'name',
      project_model_id: props.projectModelId,
      view
    })
  ), [view, props.projectModelId]);

  return (
    <Selectize
      collectionName='media_contents'
      key={view}
      onClose={props.onClose}
      onLoad={onLoad}
      onSave={props.onSave}
      renderHeader={({ onItemClick, selectedItem, selectedItems }) => (
        <>
          <div
            style={{
              marginBottom: '1em'
            }}
          >
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          </div>
          <SelectizeImageHeader
            isSelected={(item) => item === selectedItem}
            items={selectedItems}
            onItemClick={onItemClick}
            renderImage={(item) => item.content_thumbnail_url}
            renderHeader={(item) => item.name}
            selectedItem={selectedItem}
            selectedItems={selectedItems}
          />
        </>
      )}
      renderItems={({ isSelected, items: innerItems, onSelect }) => (
        <Card.Group
          className={styles.cards}
          itemsPerRow={5}
          link
        >
          { _.map(innerItems, (item) => (
            <Card
              className={styles.card}
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
