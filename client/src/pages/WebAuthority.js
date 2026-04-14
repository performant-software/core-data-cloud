// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import AtomForm from '../components/AtomForm';
import DplaForm from '../components/DplaForm';
import GeonamesForm from '../components/GeonamesForm';
import ItemLayout from '../components/ItemLayout';
import ItemHeader from '../components/ItemHeader';
import usePermissions from '../hooks/Permissions';
import styles from './ProjectModel.module.css';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import type { WebAuthority as WebAuthorityType } from '../types/WebAuthority';
import WebAuthoritiesService from '../services/WebAuthorities';
import WebAuthorityUtils from '../utils/WebAuthorities';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';

type Props = EditContainerProps & {
  item: WebAuthorityType
};

const WebAuthority = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { canEditProjectSettings } = usePermissions();

  const editPageProps = useReactRouterEditPage({
    id: 'webAuthorityId',
    onInitialize: (id) => (
      WebAuthoritiesService
        .fetchOne(id)
        .then(({ data }) => data.web_authority)
    ),
    onSave: (authority) => (
      WebAuthoritiesService
        .save(authority)
        .then(({ data }) => data.web_authority)
    ),
    required: ['source_type'],
    resolveValidationError: Validation.resolveUpdateError,
    validate: WebAuthorityUtils.validate
  });

  const { item, onSetState } = editPageProps;

  /**
   * Sets the passed value/key in the access JSON.
   *
   * @type {(function(*, *): void)|*}
   */
  const onChange = useCallback((key, value) => {
    onSetState({
      access: {
        ...item.access || {},
        [key]: value
      }
    });
  }, [onSetState, item.access]);

  /**
   * Clear "access" on source_type change
   */
  useEffect(() => {
    onSetState({ access: {} });
  }, [item.source_type]);

  /**
   * Set the project_id on the state for new records.
   */
  useEffect(() => {
    if (!item.id && projectId) {
      onSetState({ project_id: projectId });
    }
  }, []);

  if (!canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <ItemLayout>
      <ItemLayout.Header>
        <ItemHeader
          back={{
            label: t('WebAuthority.labels.all'),
            url: `/projects/${projectId}/web_authorities`
          }}
          name={WebAuthorityUtils.getSourceView(item)}
        />
      </ItemLayout.Header>
      <ItemLayout.Content>
        <SimpleEditPage
          {...props}
          {...editPageProps}
          className={styles.projectModel}
        >
          <SimpleEditPage.Tab
            key='default'
          >
            <Form.Dropdown
              error={editPageProps.isError('source_type')}
              label={t('WebAuthority.labels.sourceType')}
              onChange={editPageProps.onTextInputChange.bind(this, 'source_type')}
              options={WebAuthorityUtils.getSourceTypeOptions()}
              required={editPageProps.isRequired('source_type')}
              selectOnBlur={false}
              selection
              value={item.source_type}
            />
            { item.source_type === WebAuthorityUtils.SourceTypes.atom && (
              <AtomForm
                isError={editPageProps.isError}
                onChange={onChange}
                value={item.access}
              />
            )}
            { item.source_type === WebAuthorityUtils.SourceTypes.geonames && (
              <GeonamesForm
                isError={editPageProps.isError}
                onChange={onChange}
                value={item.access}
              />
            )}
            { item.source_type === WebAuthorityUtils.SourceTypes.dpla && (
              <DplaForm
                isError={editPageProps.isError}
                onChange={onChange}
                value={item.access}
              />
            )}
          </SimpleEditPage.Tab>
        </SimpleEditPage>
      </ItemLayout.Content>
    </ItemLayout>
  );
};

export default WebAuthority;
