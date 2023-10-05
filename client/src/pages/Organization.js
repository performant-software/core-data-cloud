// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { type AbstractComponent, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import CurrentRecordContext from '../context/CurrentRecord';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationNameModal from '../components/OrganizationNameModal';
import OrganizationService from '../services/Organizations';
import styles from './Organization.module.css';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: OrganizationType
};

const OrganizationForm = (props: Props) => {
  const { setCurrentRecord } = useContext(CurrentRecordContext);
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  /**
   * Sets the project model ID on the state from the route parameters.
   */
  useEffect(() => {
    if (!props.item.id) {
      props.onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, props.item.id]);

  /**
   * Sets the current record on the context.
   */
  useEffect(() => setCurrentRecord(props.item, Types.Organization), [props.item]);

  return (
    <SimpleEditPage
      {...props}
      className={styles.organization}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Header
          content={t('Organization.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
          className={styles.organizationNames}
          columns={[{
            name: 'name',
            label: t('Organization.organizationNames.columns.name')
          }, {
            name: 'primary',
            label: t('Organization.organizationNames.columns.primary'),
            render: (organizationName) => <BooleanIcon value={organizationName.primary} />
          }]}
          items={props.item.organization_names}
          modal={{
            component: OrganizationNameModal
          }}
          onSave={props.onSaveChildAssociation.bind(this, 'organization_names')}
          onDelete={props.onDeleteChildAssociation.bind(this, 'organization_names')}
        />
        <Form.TextArea
          error={props.isError('description')}
          label={t('Organization.labels.description')}
          onChange={props.onTextInputChange.bind(this, 'description')}
          required={props.isRequired('description')}
          value={props.item.description}
        />
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelId}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Organization'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Organization: AbstractComponent<any> = withReactRouterEditPage(OrganizationForm, {
  id: 'itemId',
  onInitialize: (id) => (
    OrganizationService
      .fetchOne(id)
      .then(({ data }) => data.organization)
  ),
  onSave: (organization) => (
    OrganizationService
      .save(organization)
      .then(({ data }) => data.organization)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Organization;
