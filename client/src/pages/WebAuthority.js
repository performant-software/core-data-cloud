// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import AtomForm from '../components/AtomForm';
import DplaForm from '../components/DplaForm';
import ItemLayout from '../components/ItemLayout';
import ItemHeader from '../components/ItemHeader';
import styles from './ProjectModel.module.css';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import type { WebAuthority as WebAuthorityType } from '../types/WebAuthority';
import WebAuthoritiesService from '../services/WebAuthorities';
import WebAuthorityUtils from '../utils/WebAuthorities';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: WebAuthorityType
};

const WebAuthorityPage = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Sets the passed value/key in the access JSON.
   *
   * @type {(function(*, *): void)|*}
   */
  const onChange = useCallback((key, value) => {
    props.onSetState({
      access: {
        ...props.item.access || {},
        [key]: value
      }
    });
  }, [props.onSetState, props.item.access]);

  /**
   * Clear "access" on source_type change
   */
  useEffect(() => {
    props.onSetState({ access: {} });
  }, [props.item.source_type]);

  /**
   * Set the project_id on the state for new records.
   */
  useEffect(() => {
    if (!props.item.id && projectId) {
      props.onSetState({ project_id: projectId });
    }
  }, []);

  return (
    <ItemLayout>
      <ItemLayout.Header>
        <ItemHeader
          back={{
            label: t('WebAuthority.labels.all'),
            url: `/projects/${projectId}/web_authorities`
          }}
          name={WebAuthorityUtils.getSourceView(props.item)}
        />
      </ItemLayout.Header>
      <ItemLayout.Content>
        <SimpleEditPage
          {...props}
          className={styles.projectModel}
        >
          <SimpleEditPage.Tab
            key='default'
          >
            <Form.Dropdown
              error={props.isError('source_type')}
              label={t('WebAuthority.labels.sourceType')}
              onChange={props.onTextInputChange.bind(this, 'source_type')}
              options={WebAuthorityUtils.getSourceTypeOptions()}
              required={props.isRequired('source_type')}
              selectOnBlur={false}
              selection
              value={props.item.source_type}
            />
            { props.item.source_type === WebAuthorityUtils.SourceTypes.atom && (
              <AtomForm
                isError={props.isError}
                onChange={onChange}
                value={props.item.access}
              />
            )}
            { props.item.source_type === WebAuthorityUtils.SourceTypes.dpla && (
              <DplaForm
                isError={props.isError}
                onChange={onChange}
                value={props.item.access}
              />
            )}
          </SimpleEditPage.Tab>
        </SimpleEditPage>
      </ItemLayout.Content>
    </ItemLayout>
  );
};

const WebAuthority = withReactRouterEditPage(WebAuthorityPage, {
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
  resolveValidationError: Validation.resolveUpdateError.bind(this),
  validate: WebAuthorityUtils.validate.bind(this)
});

export default WebAuthority;
