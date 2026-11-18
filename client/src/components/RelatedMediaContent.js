// @flow

import {
  DropdownButton,
  ItemCollection,
  ItemViews,
  LazyImage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import cx from 'classnames';
import React, {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Message } from 'semantic-ui-react';
import ItemContext from '../context/Item';
import ManifestUrlButton from './ManifestUrlButton';
import MediaContentUtils from '../utils/MediaContent';
import MediaContentsSelector from './MediaContentsSelector';
import MediaContentsService from '../services/MediaContents';
import MediaContentsUploadModal from './MediaContentsUploadModal';
import MediaUploadingMessage from './MediaUploadingMessage';
import ProjectContext from '../context/Project';
import RelatedMediaContentModal from './RelatedMediaContentModal';
import type { Relationship as RelationshipType } from '../types/Relationship';
import RelationshipsService from '../services/Relationships';
import styles from './RelatedMediaContents.module.css';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType,
  onCreateManifests: (id: number, params: { [key: string] : any }) => Promise<any>
};

const Modal = {
  upload: 0,
  link: 1
};

const RelatedMediaContentForm = (props: Props) => {
  const [creatingManifests, setCreatingManifests] = useState(false);
  const [modal, setModal] = useState(null);
  const [showUploadMessage, setShowUploadMessage] = useState(false);

  const { projectModel } = useContext(ProjectContext);
  const { uuid } = useContext(ItemContext);
  const { itemId, projectId } = useParams();
  const { foreignProjectModelId, projectModelRelationship } = useProjectModelRelationship();
  const { t } = useTranslation();

  const {
    error,
    foreignObject,
    onSelection
  } = useRelationship(props);

  /**
   * Memo-izes the manifest URL. A manifest is only generated for saved relationships to published media, so no URL
   * is returned otherwise to avoid linking to a manifest that does not exist.
   */
  const manifestUrl = useMemo(() => {
    if (!props.item.id || !foreignObject || foreignObject.published === false) {
      return null;
    }

    return MediaContentUtils.getManifestURL(projectModel, uuid, projectModelRelationship.uuid);
  }, [foreignObject, projectModel, projectModelRelationship, props.item.id, uuid]);

  /**
   * Returns the URL to navigate to the related media content's own record.
   *
   * @type {string}
   */
  const navigateUrl = useMemo(() => (
    foreignObject ? `/projects/${projectId}/${foreignObject.project_model_id}/${foreignObject.id}` : ''
  ), [foreignObject, projectId]);

  /**
   * Calls the onCreateManifests callback.
   *
   * @type {(function(): void)|*}
   */
  const onCreateManifest = useCallback(() => {
    setCreatingManifests(true);

    const params = {
      project_model_relationship_id: projectModelRelationship.id
    };

    props.onCreateManifests(itemId, params)
      .then(() => setCreatingManifests(false));
  }, [itemId, projectModelRelationship]);

  /**
   * Deletes the passed relationship.
   *
   * @type {function(*): Promise<T>}
   */
  const onDelete = useCallback((relationship) => (
    RelationshipsService
      .delete(relationship)
      .then(props.onReset)
  ), [props.onReset]);

  /**
   * Saves the passed relationship. Used when editing the relationship's user-defined fields via the edit modal.
   *
   * @type {function(*): Promise<*>}
   */
  const onSave = useCallback((relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
  ), []);

  /**
   * Calls the `/api/media_contents` API endpoint.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onLoadMedia = useCallback((params) => (
    MediaContentsService
      .fetchAll({ ...params, project_model_id: foreignProjectModelId })
  ), [foreignProjectModelId]);

  /**
   * Sets the related media content and the relationship user-defined field values on the state, then triggers an
   * auto-save of the relationship.
   *
   * @type {function(*, *): void}
   */
  const afterModalSave = useCallback((mediaContent, userDefined) => {
    if (userDefined) {
      props.onSetState({ user_defined: userDefined });
    }

    onSelection(mediaContent);
    setModal(null);
  }, [onSelection, props.onSetState]);

  /**
   * Links the single uploaded media content record to this relationship.
   *
   * @type {(function(*): void)|*}
   */
  const onUploadSave = useCallback((mediaContents) => {
    const [first] = mediaContents;

    if (!first) {
      setModal(null);
      return;
    }

    const { relationship_user_defined: userDefined, ...mediaContent } = first.mediaContent;
    afterModalSave(mediaContent, userDefined);
    setShowUploadMessage(true);
  }, [afterModalSave]);

  /**
   * Links the single selected media content record to this relationship.
   *
   * @type {(function(*): void)|*}
   */
  const onLinkSave = useCallback((selectedItems) => {
    const [first] = selectedItems;

    if (!first) {
      setModal(null);
      return;
    }

    afterModalSave(first.mediaContent, first.userDefined);
  }, [afterModalSave]);

  return (
    <>
      { showUploadMessage && (
        <MediaUploadingMessage
          multiple={false}
        />
      )}
      { error && (
        <Message
          content={error.content}
          error
          size='small'
        />
      )}
      <ItemCollection
        actions={[{
          name: 'edit',
          icon: 'pencil'
        }, {
          name: 'delete',
          icon: 'times'
        }, {
          as: Link,
          asProps: () => ({ to: navigateUrl }),
          name: 'navigate',
          icon: 'arrow right',
          popup: {
            content: t('Common.actions.navigate.content'),
            title: t('Common.actions.navigate.title')
          }
        }, {
          as: Link,
          asProps: () => ({ target: '_blank', to: navigateUrl }),
          icon: 'external alternate',
          name: 'open',
          popup: {
            content: t('Common.actions.open.content'),
            title: t('Common.actions.open.title')
          }
        }]}
        addButton={{}}
        buttons={[{
          render: () => !foreignObject && (
            <DropdownButton
              color='grey'
              direction='right'
              icon='plus'
              key='upload'
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
        }, {
          render: () => manifestUrl && (
            <ManifestUrlButton
              key='manifest'
              url={manifestUrl}
            />
          )
        }, {
          accept: () => !!foreignObject,
          color: 'grey',
          disabled: creatingManifests,
          icon: 'redo',
          content: t('RelatedMediaContent.buttons.refreshManifest'),
          loading: creatingManifests,
          onClick: onCreateManifest
        }]}
        className={cx('compact', styles.relatedMediaContents)}
        collectionName='relationships'
        defaultView={ItemViews.grid}
        dimmable={false}
        hideToggle
        items={foreignObject ? [props.item] : []}
        itemsPerRow={4}
        modal={{
          component: RelatedMediaContentModal,
          props: {
            onInitialize: props.onInitialize,
            orderable: false
          }
        }}
        onDelete={onDelete}
        onSave={onSave}
        renderEmptyList={() => null}
        renderHeader={() => (
          <div
            className={styles.header}
          >
            { foreignObject?.name }
          </div>
        )}
        renderImage={() => (
          <LazyImage
            className={cx(styles.ui, styles.small, styles.image)}
            dimmable={false}
            preview={foreignObject?.content_thumbnail_url}
            size='small'
            src={foreignObject?.content_iiif_url}
          />
        )}
        renderMeta={() => ''}
      />
      { modal === Modal.upload && (
        <MediaContentsUploadModal
          onClose={() => setModal(null)}
          onSave={onUploadSave}
          single
        />
      )}
      { modal === Modal.link && (
        <MediaContentsSelector
          collectionName='media_contents'
          onClose={() => setModal(null)}
          onLoad={onLoadMedia}
          onSave={onLinkSave}
          single
        />
      )}
    </>
  );
};

const RelatedMediaContent = withRelationshipEditForm(RelatedMediaContentForm);
export default RelatedMediaContent;
