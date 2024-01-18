// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import AtomDropdown from './AtomDropdown';
import useParams from '../hooks/ParsedParams';
import WebAuthoritiesService from '../services/WebAuthorities';
import WebAuthority from '../transforms/WebAuthority';
import WebAuthorityUtils from '../utils/WebAuthorities';
import type { WebIdentifier as WebIdentifierType } from '../types/WebIdentifier';
import WikidataDropdown from './WikidataDropdown';

type Props = EditContainerProps & {
  item: WebIdentifierType
};

const RelatedIdentifierModal = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Calls the web authorities API with the passed search parameter.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    WebAuthoritiesService
      .fetchAll({ search, project_id: projectId })
  ), [projectId]);

  return (
    <Modal
      as={Form}
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('RelatedIdentifierModal.title.edit')
          : t('RelatedIdentifierModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          error={props.isError('web_authority_id')}
          label={t('RelatedIdentifierModal.labels.authority')}
          required={props.isRequired('web_authority_id')}
        >
          <AssociatedDropdown
            collectionName='web_authorities'
            onSearch={onSearch}
            onSelection={props.onAssociationInputChange.bind(this, 'web_authority_id', 'web_authority')}
            renderOption={WebAuthority.toDropdown.bind(this)}
            searchQuery={WebAuthorityUtils.getSourceView(props.item.web_authority)}
            value={props.item.web_authority_id}
          />
        </Form.Input>
        { props.item.web_authority && (
          <Form.Input
            error={props.isError('identifier')}
            label={t('RelatedIdentifierModal.labels.identifier')}
          >
            { props.item.web_authority.source_type === WebAuthorityUtils.SourceTypes.wikidata && (
              <WikidataDropdown
                authorityId={props.item.web_authority_id}
                onChange={(identifier) => props.onSetState({ identifier })}
                value={props.item.identifier}
              />
            )}
            { props.item.web_authority.source_type === WebAuthorityUtils.SourceTypes.atom && (
              <AtomDropdown
                authorityId={props.item.web_authority_id}
                onChange={(identifier) => props.onSetState({ identifier })}
                value={props.item.identifier}
              />
            )}
          </Form.Input>
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default RelatedIdentifierModal;
