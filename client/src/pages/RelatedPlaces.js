// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RelationshipsService from '../services/Relationships';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useTranslation } from 'react-i18next';

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
        name: 'name',
        label: t('RelatedPlaces.columns.name'),
        resolve: (relationship) => relationship.related_record?.name
      }]}
      onDelete={(relationship) => RelationshipsService.delete(relationship)}
      onLoad={(params) => RelationshipsService.fetchAll({ ...params, ...parameters })}
      searchable
    />
  );
};

export default RelatedOrganizations;
