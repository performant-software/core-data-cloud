// @flow

import { DropdownButton, ItemList, LazyMedia } from '@performant-software/semantic-components';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import MediaContentsSelectize from './MediaContentsSelectize';
import MediaContentsUploadModal from './MediaContentsUploadModal';
import ProjectContext from '../context/Project';
import RelatedMediaContentModal from './RelatedMediaContentModal';
import RelationshipsService from '../services/Relationships';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import useRelationships from '../hooks/Relationships';

const Modal = {
  upload: 0,
  link: 1
};

const RelatedMediaContents = () => {
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);

  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();
  const { foreignProjectModelId, projectModelRelationship } = useProjectModelRelationship();

  const {
    onDelete,
    onInitialize,
    onLoad,
    onSave,
    resolveAttributeValue
  } = useRelationships();

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
  const onModalSave = useCallback((mediaContents) => {
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
          name: 'edit'
        }, {
          basic: false,
          name: 'delete'
        }]}
        addButton={{}}
        buttons={[{
          render: () => (
            <DropdownButton
              color='dark gray'
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
        modal={{
          component: RelatedMediaContentModal,
          props: {
            onInitialize
          }
        }}
        onDelete={onDelete}
        onLoad={onLoad}
        onSave={onSave}
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
          onSave={onModalSave}
        />
      )}
      { modal === Modal.link && (
        <MediaContentsSelectize
          projectModelId={foreignProjectModelId}
          onClose={() => setModal(null)}
          onSave={onModalSave}
        />
      )}
    </>
  );
};

export default RelatedMediaContents;
