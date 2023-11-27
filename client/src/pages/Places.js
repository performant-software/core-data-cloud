// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useContext, useState, type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { BiWorld } from 'react-icons/bi';
import { TfiMapAlt } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import PlacesService from '../services/Places';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';

const Places: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  return (
    <>
      <ListViewMenu
        icons={{
          all: (
            <Icon>
              <BiWorld />
            </Icon>
          ),
          owned: (
            <Icon>
              <TfiMapAlt />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ListTable
        actions={[{
          name: 'edit',
          onClick: (place) => navigate(`${place.id}`)
        }, {
          accept: (place) => PermissionsService.canDeleteRecord(projectModel, place),
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
        key={view}
        onDelete={(place) => PlacesService.delete(place)}
        onLoad={(params) => PlacesService.fetchAll({
          ...params,
          project_model_id: projectModelId,
          defineable_id: projectModelId,
          defineable_type: 'CoreDataConnector::ProjectModel',
          view
        })}
        searchable
      />
    </>
  );
};

export default Places;
