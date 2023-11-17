// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RelationshipsService from '../services/Relationships';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import useRelationships from '../hooks/Relationships';
import { useTranslation } from 'react-i18next';

const RelatedWorks = () => {
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
        name: 'primary_name',
        label: t('RelatedWorks.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'primary_name.name.name')
      }]}
      onDelete={(relationship) => RelationshipsService.delete(relationship)}
      onLoad={(params) => RelationshipsService.fetchAll({ ...params, ...parameters })}
      searchable
    />
  );
};

export default RelatedWorks;
