// @flow

import { Toaster } from '@performant-software/semantic-components';
import cx from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimmer,
  Divider,
  Header,
  Loader,
  Message
} from 'semantic-ui-react';
import _ from 'underscore';
import ItemContext from '../context/Item';
import ItemHeader from './ItemHeader';
import ItemLayout from './ItemLayout';
import ItemLayoutContext from '../context/ItemLayout';
import initialize from '../hooks/Item';
import ProjectContext from '../context/Project';
import ProjectItemMenu from './ProjectItemMenu';
import PublishButton from './PublishButton';
import RelatedIdentifiers from './RelatedIdentifiers';
import RelatedRecordMerges from './RelatedRecordMerges';
import Relationships from './Relationships';
import SaveButton from './SaveButton';
import Section from './Section';
import styles from './ItemPage.module.css';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';
import usePermissions from '../hooks/Permissions';
import Validation from '../utils/Validation';
import RecordVersions from './RecordVersions';

type Props = {
  form: Element<any>,
  loading: boolean,
  onInitialize: (id: number) => Promise<any>,
  onLoadVersions: (id: number, params: any) => Promise<any>,
  onPublish: (id: number, published: boolean) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  saving?: boolean
};

type ComponentProps = {
  errors?: Array<string>,
  form: any,
  item: any,
  loading: boolean,
  onCreateManifests: (item: any) => Promise<any>,
  onLoadVersions: (id: number, params: any) => Promise<any>,
  onPublish: (id: number, published: boolean) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  onSaved: (item: any) => void,
  onSetState: (props: any) => void,
  saved?: boolean,
  saving?: boolean
};

const Component = (props: ComponentProps) => {
  const [publishError, setPublishError] = useState(null);
  const [saved, setSaved] = useState(false);

  const { label, name, url } = initialize(props);
  const { projectModel } = useContext(ProjectContext);
  const { canPublishRecord } = usePermissions();
  const { t } = useTranslation();

  /**
   * Memo-izes the ItemLayoutContext value.
   *
   * @type {{saved: boolean, setSaved: function(): void}}
   */
  const layoutValue = useMemo(() => ({ saved, setSaved }), [saved, setSaved]);

  /**
   * Memo-izes the ItemContext value.
   *
   * @type {{uuid: *}}
   */
  const itemValue = useMemo(() => ({ uuid: props.item.uuid }), [props.item?.uuid]);

  /**
   * Returns true if the current user can publish and unpublish the current record.
   *
   * @type {boolean}
   */
  const canPublish = useMemo(() => (
    canPublishRecord(projectModel, props.item)
  ), [canPublishRecord, projectModel, props.item]);

  /**
   * Memo-izes the list of errors to display, including any error encountered publishing the record.
   *
   * @type {Array<string>}
   */
  const errors = useMemo(() => (
    _.compact([...(props.errors || []), publishError])
  ), [props.errors, publishError]);

  /**
   * Loads the versions for the current item.
   *
   * @type {function(*): Promise<any>}
   */
  const onLoadVersions = useCallback((params) => (
    props.onLoadVersions(props.item.id, params)
  ), [props.item?.id, props.onLoadVersions]);

  /**
   * Sets the published state of the current item.
   *
   * @type {function(boolean): Promise<any>}
   */
  const onPublish = useCallback((published) => (
    props
      .onPublish(props.item.id, published)
      .then(() => {
        setPublishError(null);
        props.onSetState({ published });
      })
      .catch(() => setPublishError(t('PublishButton.errors.publish')))
  ), [props.item?.id, props.onPublish, props.onSetState, t]);

  /**
   * Sets the saved prop on the state when the component is mounted.
   */
  useEffect(() => {
    if (props.saved) {
      setSaved(true);
    }
  }, [props.saved]);

  return (
    <ItemLayoutContext.Provider
      value={layoutValue}
    >
      <ItemContext.Provider
        value={itemValue}
      >
        <ItemLayout
          className={styles.itemPage}
        >
          <ItemLayout.Toaster
            onDismiss={() => setSaved(false)}
            type={Toaster.MessageTypes.positive}
            visible={saved}
          >
            <Message.Header
              content={t('Common.messages.save.header')}
            />
            <Message.Content
              content={t('Common.messages.save.content')}
            />
          </ItemLayout.Toaster>
          <ItemLayout.Toaster
            timeout={0}
            type={Toaster.MessageTypes.negative}
            visible={!_.isEmpty(errors)}
          >
            <Message.Header
              content={t('Common.errors.header')}
            />
            <Message.List
              items={errors}
            />
          </ItemLayout.Toaster>
          <ItemLayout.Header>
            <ItemHeader
              back={{
                label,
                url
              }}
              name={name}
            />
          </ItemLayout.Header>
          <ItemLayout.Sidebar>
            <ProjectItemMenu />
          </ItemLayout.Sidebar>
          <ItemLayout.Content>
            <Dimmer
              active={props.loading}
              inverted
            >
              <Loader />
            </Dimmer>
            <Section
              id='details'
            >
              <div
                className={styles.actions}
              >
                <div
                  className={styles.saveContainer}
                >
                  <SaveButton
                    onClick={props.onSave}
                    saving={props.saving}
                  />
                </div>
                { canPublish && (
                  <PublishButton
                    onPublish={onPublish}
                    published={!!props.item.published}
                  />
                )}
              </div>
              <Header
                className={cx(styles.ui, styles.header)}
                content={t('ItemPage.labels.details')}
              />
              <props.form
                {...props}
              />
              <SaveButton
                onClick={props.onSave}
                saving={props.saving}
              />
            </Section>
            <Relationships
              key={props.item?.id}
              onCreateManifests={props.onCreateManifests}
            />
            { projectModel?.allow_identifiers && props.item.id && (
              <Section
                id='identifiers'
              >
                <Divider
                  section
                />
                <Header
                  content={t('ItemPage.labels.identifiers')}
                />
                <RelatedIdentifiers />
              </Section>
            )}
            <Section
              id='merges'
            >
              <Divider
                section
              />
              <Header
                content={t('ItemPage.labels.merges')}
              />
              <RelatedRecordMerges />
            </Section>
            { props.item.id && (
              <Section
                id='versions'
              >
                <Divider
                  section
                />
                <Header
                  content={t('ItemPage.labels.versionHistory')}
                />
                <RecordVersions
                  onLoad={onLoadVersions}
                />
              </Section>
            )}
          </ItemLayout.Content>
        </ItemLayout>
      </ItemContext.Provider>
    </ItemLayoutContext.Provider>
  );
};

const ItemPage = (props: Props) => {
  const {
    onCreateManifests,
    onInitialize,
    onSave
  } = props;

  const editPageProps = useReactRouterEditPage({
    id: 'itemId',
    onCreateManifests,
    onSave,
    onInitialize,
    resolveValidationError: Validation.resolveUpdateError
  });

  return (
    <Component
      {...props}
      {...editPageProps}
    />
  );
};

export default ItemPage;