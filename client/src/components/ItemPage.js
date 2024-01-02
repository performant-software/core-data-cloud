// @flow

import React, { useCallback } from 'react';
import ItemLayout from './ItemLayout';
import ItemHeader from './ItemHeader';
import initialize from '../hooks/Item';
import ProjectItemMenu from './ProjectItemMenu';
import Relationships from './Relationships';
import SaveButton from './SaveButton';
import Section from './Section';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = {
  form: Element<any>,
  onInitialize: (id: number) => Promise<any>,
  onSave: (item: any) => Promise<any>
};

const ItemPage = ({ form: Form, onInitialize, onSave }: Props) => {
  const Component = useCallback((props) => {
    const { label, name, url } = initialize(props);

    return (
      <ItemLayout>
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
