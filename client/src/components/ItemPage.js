// @flow

import { Toaster } from '@performant-software/semantic-components';
import cx from 'classnames';
import React, {
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
import RelatedIdentifiers from './RelatedIdentifiers';
import RelatedRecordMerges from './RelatedRecordMerges';
import Relationships from './Relationships';
import SaveButton from './SaveButton';
import Section from './Section';
import styles from './ItemPage.module.css';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';
import Validation from '../utils/Validation';

type Props = {
  form: Element<any>,
  loading: boolean,
  onInitialize: (id: number) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  saving?: boolean
};

type ComponentProps = {
  errors?: Array<string>,
  form: any,
  item: any,
  loading: boolean,
  onCreateManifests: (item: any) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  onSaved: (item: any) => void,
  saved?: boolean,
  saving?: boolean
};

const Component = (props: ComponentProps) => {
  const [saved, setSaved] = useState(false);
  const { label, name, url } = initialize(props);
  const { projectModel } = useContext(ProjectContext);
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
            visible={!_.isEmpty(props.errors)}
          >
            <Message.Header
              content={t('Common.errors.header')}
            />
            <Message.List
              items={props.errors}
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
              <SaveButton
                onClick={props.onSave}
                saving={props.saving}
              />
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