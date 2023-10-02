// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PlacesService from '../services/Places';
import useParams from '../hooks/ParsedParams';

const Places: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { projectModelId } = useParams();
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
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='places'
      columns={[{
        name: 'name',
        label: t('Places.columns.name'),
        sortable: true
      }]}
      onDelete={(place) => PlacesService.delete(place)}
      onLoad={(params) => PlacesService.fetchAll({
        ...params,
        project_model_id: projectModelId,
        defineable_id: projectModelId,
        defineable_type: 'CoreDataConnector::ProjectModel'
      })}
      searchable
    />
  );
};

export default Places;
