// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiBuildingOffice, HiBuildingOffice2 } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import OrganizationsService from '../services/Organizations';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';

const Organizations: AbstractComponent<any> = () => {
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
              <HiBuildingOffice2 />
            </Icon>
          ),
          owned: (
            <Icon>
              <HiBuildingOffice />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ListTable
        actions={[{
          name: 'edit',
          onClick: (organization) => navigate(`${organization.id}`)
        }, {
          accept: (organization) => PermissionsService.canDeleteRecord(projectModel, organization),
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
        key={view}
        onDelete={(organization) => OrganizationsService.delete(organization)}
        onLoad={(params) => OrganizationsService.fetchAll({
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

export default Organizations;
