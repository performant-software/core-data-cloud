// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PeopleService from '../services/People';
import useParams from '../hooks/ParsedParams';

const People: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (person) => navigate(`${person.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='people'
      columns={[{
        name: 'last_name',
        label: t('People.columns.lastName'),
        sortable: true
      }, {
        name: 'first_name',
        label: t('People.columns.firstName'),
        sortable: true
      }, {
        name: 'project',
        label: t('Common.labels.project'),
        resolve: (person) => person.project_item?.project?.name
      }]}
      onDelete={(place) => PeopleService.delete(place)}
      onLoad={(params) => PeopleService.fetchAll({ ...params, project_id: projectId })}
      searchable
    />
  );
};

export default People;
