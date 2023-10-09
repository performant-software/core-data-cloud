// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OrganizationsService from '../services/Organizations';
import useParams from '../hooks/ParsedParams';

const Organizations: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (organization) => navigate(`${organization.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='organizations'
      columns={[{
        name: 'name',
        label: t('Organizations.columns.name'),
        sortable: true
      }]}
      onDelete={(organization) => OrganizationsService.delete(organization)}
      onLoad={(params) => OrganizationsService.fetchAll({
        ...params,
        project_model_id: projectModelId,
        defineable_id: projectModelId,
        defineable_type: 'CoreDataConnector::ProjectModel'
      })}
      searchable
    />
  );
};

export default Organizations;
