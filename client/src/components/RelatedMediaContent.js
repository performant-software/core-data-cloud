// @flow

import { EditModal, FileInputButton, LazyIIIF } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'semantic-ui-react';
import _ from 'underscore';
import MediaContentsService from '../services/MediaContents';
import RelatedMediaContentModal from './RelatedMediaContentModal';
import type { Relationship as RelationshipType } from '../types/Relationship';
import RelationshipsService from '../services/Relationships';
import { useRelationship } from '../hooks/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedMediaContentForm = (props: Props) => {
  const [editModal, setEditModal] = useState(false);

  const { foreignProjectModelId } = useProjectModelRelationship();
  const { foreignObject, onSelection } = useRelationship(props);
  const { t } = useTranslation();

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => (IIIFUtils.createManifestURL(foreignObject?.manifest)), [foreignObject?.manifest]);

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

    MediaContentsService.save({
      project_model_id: foreignProjectModelId,
      name: file.name,
      content: file
    }).then(({ data }) => onSelection(data.media_content));
  }, [foreignProjectModelId, onSelection]);

  return (
    <Form>
      <Form.Input>
        <LazyIIIF
          color='teal'
          contentType={foreignObject?.content_type}
          downloadUrl={foreignObject?.content_download_url}
          key={foreignObject?.id}
          manifest={manifest}
          preview={foreignObject?.content_preview_url}
          src={foreignObject?.content_url}
        >
          { !props.item.id && (
            <FileInputButton
              color='yellow'
              content={t('Common.buttons.upload')}
              icon='cloud upload'
              onSelection={onUpload}
            />
          )}
          { props.item.id && (
            <>
              <Button
                color='orange'
                content={t('Common.buttons.edit')}
                icon='edit'
                onClick={() => setEditModal(true)}
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
