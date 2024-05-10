// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useContext, useState } from 'react';
import { FaTag, FaTags } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import TaxonomiesService from '../services/Taxonomies';
import { useTranslation } from 'react-i18next';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

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
          icon: 'pencil',
          onClick: (taxonomy) => navigate(`${taxonomy.id}`)
        }, {
          accept: (taxonomy) => PermissionsService.canDeleteRecord(projectModel, taxonomy),
          icon: 'times',
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
        onLoad={(params) => (
          TaxonomiesService
            .fetchAll({ ...params, project_model_id: projectModelId, view })
            .finally(() => WindowUtils.scrollToTop())
        )}
        searchable
      />
    </>
  );
};

export default TaxonomyItems;
