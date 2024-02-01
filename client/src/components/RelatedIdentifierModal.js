// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import AtomIdentifierForm from './AtomIdentifierForm';
import BnfIdentifierForm from './BnfIdentifierForm';
import DplaIdentifierForm from './DplaIdentifierForm';
import JiscIdentifierForm from './JiscIdentifierForm';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import ViafIdentifierForm from './ViafIdentifierForm';
import WebAuthoritiesService from '../services/WebAuthorities';
import WebAuthority from '../transforms/WebAuthority';
import WebAuthorityUtils from '../utils/WebAuthorities';
import type { WebIdentifier as WebIdentifierType } from '../types/WebIdentifier';
import WikidataIdentifierForm from './WikidataIdentifierForm';

type Props = EditContainerProps & {
  item: WebIdentifierType
};

const RelatedIdentifierModal = (props: Props) => {
  const { projectModel } = useContext(ProjectContext);
  const { projectId, itemId } = useParams();
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

  /**
   * Set the identifiable ID and identifiable type on the state for new records.
   */
  useEffect(() => {
    if (!props.item.id) {
      props.onSetState({
        identifiable_id: itemId,
        identifiable_type: projectModel?.model_class
      });
    }
  }, []);

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
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.atom && (
          <AtomIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            extra={props.item.extra}
            onExtraSelection={(key, e, { value }) => props.onSetState({
              extra: {
                ...props.item.extra || {},
                [key]: value
              }
            })}
            onSelection={(identifier) => props.onSetState({ identifier, extra: {} })}
            value={props.item.identifier}
          />
        )}
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.bnf && (
          <BnfIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            onSelection={(identifier) => props.onSetState({ identifier })}
            value={props.item.identifier}
          />
        )}
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.dpla && (
          <DplaIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            onSelection={(identifier) => props.onSetState({ identifier })}
            value={props.item.identifier}
          />
        )}
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.jisc && (
          <JiscIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            onSelection={(identifier) => props.onSetState({ identifier })}
            value={props.item.identifier}
          />
        )}
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.viaf && (
          <ViafIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            onSelection={(identifier) => props.onSetState({ identifier })}
            value={props.item.identifier}
          />
        )}
        { props.item.web_authority?.source_type === WebAuthorityUtils.SourceTypes.wikidata && (
          <WikidataIdentifierForm
            authorityId={props.item.web_authority_id}
            error={props.isError('identifier')}
            onSelection={(identifier) => props.onSetState({ identifier })}
            value={props.item.identifier}
          />
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default RelatedIdentifierModal;
