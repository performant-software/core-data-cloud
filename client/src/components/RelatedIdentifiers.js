// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectContext from '../context/Project';
import RelatedIdentifierModal from './RelatedIdentifierModal';
import useParams from '../hooks/ParsedParams';
import WebAuthorityUtils from '../utils/WebAuthorities';
import WebIdentifierUtils from '../utils/WebIdentifiers';
import WebIdentifiersService from '../services/WebIdentifiers';

const RelatedIdentifiers = () => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();
  const { t } = useTranslation();

  /**
   * Deletes the passed identifier.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onDelete = useCallback((identifier) => WebIdentifiersService.delete(identifier), []);

  /**
   * Initializes the identifier with the passed ID.
   *
   * @type {function(*): Promise<{readonly data?: *}>}
   */
  const onInitialize = useCallback((id) => (
    WebIdentifiersService
      .fetchOne(id)
      .then(({ data }) => data.web_identifier)
  ), []);

  /**
   * Loads the list of identifiers with the passed parameters.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onLoad = useCallback((params) => (
    WebIdentifiersService
      .fetchAll({
        ...params,
        identifiable_id: itemId,
        identifiable_type: projectModel?.model_class
      })
  ), [itemId, projectModel]);

  /**
   * Saves the passed identifier.
   *
   * @type {function(*): Promise<{readonly data?: *}>}
   */
  const onSave = useCallback((identifier) => (
    WebIdentifiersService
      .save(identifier)
      .then(({ data }) => data.web_identifier)
  ), [itemId, projectModel]);

  return (
    <ListTable
      actions={[{
        name: 'edit'
      }, {
        name: 'delete'
      }, {
        accept: (identifier) => !!WebIdentifierUtils.getURL(identifier),
        icon: 'share square',
        name: 'open',
        onClick: (identifier) => window.open(WebIdentifierUtils.getURL(identifier), '_blank'),
        popup: {
          title: t('RelatedIdentifiers.actions.open.title'),
          content: t('RelatedIdentifiers.actions.open.content')
        }
      }]}
      addButton={{
        basic: false,
        color: 'dark gray',
        location: 'top'
      }}
      className='compact'
      collectionName='web_identifiers'
      columns={[{
        name: 'core_data_connector_web_authorities.source_type',
        label: t('RelatedIdentifiers.labels.sourceType'),
        resolve: (identifier) => WebAuthorityUtils.getSourceView(identifier.web_authority),
        sortable: true
      }, {
        name: 'identifier',
        label: t('RelatedIdentifiers.labels.identifier'),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedIdentifierModal,
        props: {
          onInitialize,
          required: ['web_authority_id']
        }
      }}
      onDelete={onDelete}
      onLoad={onLoad}
      onSave={onSave}
    />
  );
};

export default RelatedIdentifiers;
