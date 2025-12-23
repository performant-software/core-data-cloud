// @flow

import { EditModal, FileInputButton, LazyIIIF } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'semantic-ui-react';
import _ from 'underscore';
import ItemContext from '../context/Item';
import ManifestUrlButton from './ManifestUrlButton';
import MediaContentUtils from '../utils/MediaContent';
import MediaContentsService from '../services/MediaContents';
import ProjectContext from '../context/Project';
import RelatedMediaContentModal from './RelatedMediaContentModal';
import type { Relationship as RelationshipType } from '../types/Relationship';
import RelationshipsService from '../services/Relationships';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType,
  onCreateManifests: (id: number, params: { [key: string] : any }) => Promise<any>
};

const RelatedMediaContentForm = (props: Props) => {
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { project, projectModel } = useContext(ProjectContext);
  const { uuid } = useContext(ItemContext);
  const { itemId } = useParams();
  const { foreignProjectModelId, projectModelRelationship } = useProjectModelRelationship();
  const { t } = useTranslation();

  const {
    error,
    foreignObject,
    onNavigate,
    onSelection
  } = useRelationship(props);

  /**
   * Memo-izes the manifest URL.
   */
  const manifestUrl = useMemo(() => (
    MediaContentUtils.getManifestURL(projectModel, uuid, projectModelRelationship.uuid)
  ), [projectModel, projectModelRelationship, uuid])

  /**
   * Calls the onCreateManifests callback.
   *
   * @type {(function(): void)|*}
   */
  const onCreateManifest = useCallback(() => {
    setSaving(true);

    const params = {
      project_model_relationship_id: projectModelRelationship.id
    };

    props.onCreateManifests(itemId, params)
      .then(() => setSaving(false));
  }, [itemId, projectModelRelationship])

  /**
   * Deletes the current relationship.
   *
   * @type {function(): Promise<T>}
   */
  const onDelete = useCallback(() => (
    RelationshipsService
      .delete(props.item)
      .then(props.onReset)
  ), [props.item, props.onReset]);

  /**
   * Saves the passed relationship.
   *
   * @type {function(*): Promise<void>}
   */
  const onSave = useCallback((relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
      .finally(() => setEditModal(false))
  ), []);

  /**
   * Uploads the passed file.
   *
   * @type {(function(*): void)|*}
   */
  const onUpload = useCallback((files) => {
    const file = _.first(files);

    const mediaContent = {
      project_model_id: foreignProjectModelId,
      name: file.name,
      content: file
    };

    MediaContentsService
      .uploadOne(mediaContent, project)
      .then(({ data }) => onSelection(data.media_content))
  }, [foreignProjectModelId, onSelection]);

  return (
    <Form>
      <Form.Input
        error={error}
      >
        <LazyIIIF
          color='teal'
          contentType={foreignObject?.content_type}
          downloadUrl={foreignObject?.content_download_url}
          key={foreignObject?.id}
          manifest={manifestUrl}
          preview={foreignObject?.content_preview_url}
          src={foreignObject?.content_url}
        >
          { !props.item.id && (
            <>
              <FileInputButton
                color='yellow'
                content={t('Common.buttons.upload')}
                icon='cloud upload'
                onSelection={onUpload}
              />
              <Button
                color='orange'
                content={t('Common.buttons.edit')}
                icon='edit'
                onClick={() => setEditModal(true)}
              />
            </>
          )}
          { props.item.id && (
            <>
              <Button
                color='green'
                content={t('Common.buttons.edit')}
                icon='pencil'
                onClick={onNavigate}
              />
              <ManifestUrlButton
                url={manifestUrl}
              />
              <Button
                color='grey'
                content={t('RelatedMediaContent.buttons.refreshManifest')}
                disabled={saving}
                icon='redo'
                loading={saving}
                onClick={onCreateManifest}
              />
              <Button
                color='red'
                content={t('Common.buttons.delete')}
                icon='trash'
                onClick={onDelete}
              />
            </>
          )}
        </LazyIIIF>
      </Form.Input>
      { editModal && (
        <EditModal
          component={RelatedMediaContentModal}
          item={props.item}
          onClose={() => setEditModal(false)}
          onInitialize={props.onInitialize}
          onSave={onSave}
        />
      )}
    </Form>
  );
};

const RelatedMediaContent = withRelationshipEditForm(RelatedMediaContentForm);
export default RelatedMediaContent;
