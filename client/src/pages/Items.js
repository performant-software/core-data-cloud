// @flow

import React, {
  type AbstractComponent,
  useState,
  useContext
} from 'react';

import { Icon } from 'semantic-ui-react';
import { IoDocumentsSharp } from 'react-icons/io5';
import { IoMdDocument } from 'react-icons/io';
import ItemsService from '../services/Items';
import { ListTable } from '@performant-software/semantic-components';
import ListViewMenu from '../components/ListViewMenu';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Items: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);
  const [saved] = useState(false);

  const { t } = useTranslation();

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();

  return (
    <>
      <ListViewMenu
        icons={{
          all: (
            <Icon>
              <IoDocumentsSharp />
            </Icon>
          ),
          owned: (
            <Icon>
              <IoMdDocument />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ListTable
        actions={[{
          name: 'edit',
          onClick: (item) => navigate(`${item.id}`)
        }, {
          accept: (item) => PermissionsService.canDeleteRecord(projectModel, item),
          name: 'delete',
          label: t('Items.columnsid')
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='items'
        columns={[{
          label: t('Items.columns.name'),
          name: 'primary_name',
          resolve: (item) => item.primary_name?.name?.name
        }]}
        key={view}
        onDelete={(item) => ItemsService.delete(item)}
        onLoad={(params) => ItemsService.fetchAll({
          ...params,
          project_model_id: projectModelId,
          view
        })}
        saved={saved}
        searchable
      />
    </>
  );
};

export default Items;
