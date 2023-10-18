// @flow

import { DropdownButton, ItemList, LazyMedia } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'underscore';
import MediaContentsSelectize from '../components/MediaContentsSelectize';
import MediaContentsUploadModal from '../components/MediaContentsUploadModal';
import RelationshipsService from '../services/Relationships';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useTranslation } from 'react-i18next';

const Modal = {
  upload: 0,
  link: 1
};

const RelatedMediaContents = () => {
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();
  const { itemId, projectModelRelationshipId } = useParams();
  const { parameters, primaryClass } = useProjectModelRelationship();
  const { t } = useTranslation();

  /**
   * Uploads the passed media contents as related record relationships.
   *
   * @type {(function(*): void)|*}
   */
  const onSave = useCallback((mediaContents) => {
    const relationships = _.map(mediaContents, (mediaContent) => ({
      project_model_relationship_id: projectModelRelationshipId,
      primary_record_id: itemId,
      primary_record_type: primaryClass,
      related_record_id: mediaContent.id,
      related_record_type: 'CoreDataConnector::MediaContent'
    }));

    RelationshipsService
      .upload(relationships)
      .then(() => {
        setModal(null);
        setSaved(true);
      });
  }, [itemId, primaryClass, projectModelRelationshipId]);

  return (
    <>
      <ItemList
        actions={[{
          basic: false,
          name: 'edit',
          onClick: (item) => navigate(`${item.id}`)
        }, {
          basic: false,
          name: 'delete'
        }]}
        addButton={undefined}
        buttons={[{
          render: () => (
            <DropdownButton
              color='blue'
              direction='right'
              icon='plus'
              onChange={(e, { value }) => setModal(value)}
              options={[{
                icon: 'cloud upload',
                key: Modal.upload,
                text: t('RelatedMediaContents.options.upload'),
                value: Modal.upload
              }, {
                icon: 'linkify',
                key: Modal.link,
                text: t('RelatedMediaContents.options.link'),
                value: Modal.link
              }]}
              text={t('Common.buttons.add')}
              value={modal}
            />
          )
        }]}
        collectionName='relationships'
        onDelete={(relationship) => RelationshipsService.delete(relationship)}
        onLoad={(params) => RelationshipsService.fetchAll({ ...params, ...parameters })}
        renderEmptyList={() => null}
        renderHeader={(relationship) => relationship.related_record?.name}
        renderImage={(relationship) => (
          <LazyMedia
            dimmable={false}
            contentType={relationship.related_record?.content_type}
            preview={relationship.related_record?.content_thumbnail_url}
          />
        )}
        renderMeta={() => ''}
        saved={saved}
      />
      { modal === Modal.upload && (
        <MediaContentsUploadModal
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}
      { modal === Modal.link && (
        <MediaContentsSelectize
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}
    </>
  );
};

export default RelatedMediaContents;
