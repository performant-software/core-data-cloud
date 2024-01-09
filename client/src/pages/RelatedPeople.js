// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RelationshipsService from '../services/Relationships';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import useRelationships from '../hooks/Relationships';

const RelatedOrganizations = () => {
  const navigate = useNavigate();
  const { parameters } = useProjectModelRelationship();
  const { resolveAttributeValue } = useRelationships();
  const { t } = useTranslation();

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (relationship) => navigate(`${relationship.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='relationships'
      columns={[{
        name: 'core_data_connector_person_names.last_name',
        label: t('RelatedPeople.columns.lastName'),
        resolve: resolveAttributeValue.bind(this, 'last_name'),
        sortable: true
      }, {
        name: 'core_data_connector_person_names.first_name',
        label: t('RelatedPeople.columns.firstName'),
        resolve: resolveAttributeValue.bind(this, 'first_name'),
        sortable: true
      }]}
      onDelete={(relationship) => RelationshipsService.delete(relationship)}
      onLoad={(params) => RelationshipsService.fetchAll({ ...params, ...parameters })}
      searchable
    />
  );
};

export default RelatedOrganizations;