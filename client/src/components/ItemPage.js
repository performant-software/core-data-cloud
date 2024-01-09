// @flow

import cx from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import ItemHeader from './ItemHeader';
import ItemLayout from './ItemLayout';
import ItemLayoutContext from '../context/ItemLayout';
import initialize from '../hooks/Item';
import ProjectItemMenu from './ProjectItemMenu';
import Relationships from './Relationships';
import SaveButton from './SaveButton';
import Section from './Section';
import styles from './ItemPage.module.css';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = {
  form: Element<any>,
  onInitialize: (id: number) => Promise<any>,
  onSave: (item: any) => Promise<any>
};

type ComponentProps = {
  onSaved: (item: any) => void,
  saved?: boolean
};

const ItemPage = ({ form: Form, onInitialize, onSave }: Props) => {
  const { t } = useTranslation();

  const Component = useCallback((props: ComponentProps) => {
    const [saved, setSaved] = useState(false);
    const { label, name, url } = initialize(props);

    /**
     * Memo-izes the ItemLayoutContext value.
     *
     * @type {{saved: boolean, setSaved: function(): void}}
     */
    const value = useMemo(() => ({ saved, setSaved }), [saved, setSaved]);

    /**
     * Sets the saved prop on the state when the component is mounted.
     */
    useEffect(() => {
      if (props.saved) {
        setSaved(true);
      }
    }, []);

    return (
      <ItemLayoutContext.Provider
        value={value}
      >
        <ItemLayout
          className={styles.itemPage}
        >
          <ItemLayout.Toaster
            onDismiss={() => setSaved(false)}
            visible={saved}
          />
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
            <Section
              id='details'
            >
              <Header
                className={cx(styles.ui, styles.header)}
                content={t('ItemPage.labels.details')}
              />
              <Form
                {...props}
              />
              <SaveButton
                onClick={props.onSave}
              />
            </Section>
            <Relationships />
          </ItemLayout.Content>
        </ItemLayout>
      </ItemLayoutContext.Provider>
    );
  }, []);

  const Page = withReactRouterEditPage(Component, {
    id: 'itemId',
    onSave,
    onInitialize,
    resolveValidationError: Validation.resolveUpdateError.bind(this)
  });

  return (
    <Page />
  );
};

export default ItemPage;
