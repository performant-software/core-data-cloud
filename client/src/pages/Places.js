// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PlacesService from '../services/Places';

const Places: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (place) => navigate(`${place.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='places'
      columns={[{
        name: 'name',
        label: t('Places.columns.name'),
        sortable: true
      }, {
        name: 'project',
        label: t('Places.columns.project'),
        resolve: (place) => place.project_item?.project?.name
      }]}
      onDelete={(place) => PlacesService.delete(place)}
      onLoad={(params) => PlacesService.fetchAll({ ...params, project_id: projectId })}
      searchable
    />
  );
};

export default Places;
