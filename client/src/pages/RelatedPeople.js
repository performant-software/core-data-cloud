// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RelationshipsService from '../services/Relationships';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const RelatedOrganizations = () => {
  const navigate = useNavigate();
  const { parameters } = useProjectModelRelationship();
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
        name: 'last_name',
        label: t('RelatedPeople.columns.lastName'),
        resolve: (relationship) => relationship.related_record?.last_name
      }, {
        name: 'first_name',
        label: t('RelatedPeople.columns.firstName'),
        resolve: (relationship) => relationship.related_record?.first_name
      }]}
      onDelete={(relationship) => RelationshipsService.delete(relationship)}
      onLoad={(params) => RelationshipsService.fetchAll({ ...params, ...parameters })}
      searchable
    />
  );
};

export default RelatedOrganizations;
