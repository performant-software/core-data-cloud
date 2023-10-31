// @flow

import { DropdownButton, ItemList, LazyMedia } from '@performant-software/semantic-components';
import React, { useCallback, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'underscore';
import MediaContentsSelectize from '../components/MediaContentsSelectize';
import MediaContentsUploadModal from '../components/MediaContentsUploadModal';
import RelationshipsService from '../services/Relationships';
import ProjectContext from '../context/Project';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import useRelationships from '../hooks/Relationships';
import { useTranslation } from 'react-i18next';

const Modal = {
  upload: 0,
  link: 1
};

const RelatedMediaContents = () => {
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { foreignProjectModelId, parameters, projectModelRelationship } = useProjectModelRelationship();
  const { resolveAttributeValue } = useRelationships();
  const { t } = useTranslation();

  /**
   * Returns the relationship props for the passed media content record.
   *
   * @type {function(*): {
   *  project_model_relationship_id: *,
   *  primary_record_id: string,
   *  primary_record_type: *,
   *  related_record_id: *,
   *  related_record_type: string
   *  }
   * }
   */
  const createRelationship = useCallback((mediaContent) => ({
    project_model_relationship_id: projectModelRelationship.id,
    primary_record_id: itemId,
    primary_record_type: projectModel?.model_class,
    related_record_id: mediaContent.id,
    related_record_type: 'CoreDataConnector::MediaContent'
  }), [projectModel, projectModelRelationship]);

  /**
   * Returns the relationship props for the passed media content record.
   *
   * @type {function(*): {
   *  project_model_relationship_id: *,
   *  primary_record_id: string,
   *  primary_record_type: *,
   *  related_record_id: *,
   *  related_record_type: string
   *  }
   * }
   */
  const createInverseRelationship = useCallback((mediaContent) => ({
    project_model_relationship_id: projectModelRelationship.id,
    primary_record_id: mediaContent.id,
    primary_record_type: 'CoreDataConnector::MediaContent',
    related_record_id: itemId,
    related_record_type: projectModel?.model_class
  }), [projectModel, projectModelRelationship]);

  /**
   * Uploads the passed media contents as related record relationships.
   *
   * @type {(function(*): void)|*}
   */
  const onSave = useCallback((mediaContents) => {
    const relationships = _.map(mediaContents, (mediaContent) => (
      projectModelRelationship.inverse
        ? createInverseRelationship(mediaContent)
        : createRelationship(mediaContent)
    ));

    RelationshipsService
      .upload(relationships)
      .then(() => {
        setModal(null);
        setSaved(true);
      });
  }, [createInverseRelationship, createRelationship, projectModelRelationship]);

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
        renderHeader={resolveAttributeValue.bind(this, 'name')}
        renderImage={(relationship) => (
          <LazyMedia
            dimmable={false}
            contentType={resolveAttributeValue('content_type', relationship)}
            preview={resolveAttributeValue('content_thumbnail_url', relationship)}
          />
        )}
        renderMeta={() => ''}
        saved={saved}
        sort={[{
          key: 'core_data_connector_media_contents.name',
          value: 'core_data_connector_media_contents.name',
          text: t('RelatedMediaContents.sort.name')
        }]}
      />
      { modal === Modal.upload && (
        <MediaContentsUploadModal
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}
      { modal === Modal.link && (
        <MediaContentsSelectize
          projectModelId={foreignProjectModelId}
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}
    </>
  );
};

export default RelatedMediaContents;
