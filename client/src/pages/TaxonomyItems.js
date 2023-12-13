// @flow

import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import { ListTable } from '@performant-software/semantic-components';
import { useTranslation } from 'react-i18next';
import TaxonomiesService from '../services/Taxonomies';
import Views from '../constants/ListViews';
import ListViewMenu from '../components/ListViewMenu';
import { FaTag, FaTags } from 'react-icons/fa6';
import { Icon } from 'semantic-ui-react';

const TaxonomyItems = () => {
  const [view, setView] = useState(Views.all);

  const { projectModelId } = useParams();
  const { projectModel } = useContext(ProjectContext);

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <ListViewMenu
        icons={{
          all: (
            <Icon>
              <FaTags />
            </Icon>
          ),
          owned: (
            <Icon>
              <FaTag />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ListTable
        actions={[{
          name: 'edit',
          onClick: (taxonomy) => navigate(`${taxonomy.id}`)
        }, {
          accept: (taxonomy) => PermissionsService.canDeleteRecord(projectModel, taxonomy),
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='taxonomies'
        columns={[{
          name: 'name',
          label: t('TaxonomyItems.columns.name'),
          sortable: true
        }]}
        key={view}
        onDelete={(taxonomy) => TaxonomiesService.delete(taxonomy)}
        onLoad={(params) => TaxonomiesService.fetchAll({
          ...params,
          project_model_id: projectModelId,
          view
        })}
        searchable
      />
    </>
  );
};

export default TaxonomyItems;
