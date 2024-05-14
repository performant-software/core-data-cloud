// @flow

import { ListTable } from '@performant-software/semantic-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { Icon } from 'semantic-ui-react';
import { IoMdDocument } from 'react-icons/io';
import { IoDocumentsSharp } from 'react-icons/io5';
import ItemsService from '../services/Items';
import ListViewMenu from '../components/ListViewMenu';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Items: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { t } = useTranslation();

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();

  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the items columns.
   */
  const columns = useMemo(() => [{
    label: t('Items.columns.name'),
    name: 'core_data_connector_names.name',
    resolve: (item) => item.primary_name?.name?.name,
    sortable: true
  }, {
    name: 'uuid',
    label: t('Common.columns.uuid'),
    sortable: true,
    hidden: true
  }, ...userDefinedColumns], [userDefinedColumns]);

  if (loading) {
    return null;
  }

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
          icon: 'pencil',
          onClick: (item) => navigate(`${item.id}`)
        }, {
          accept: (item) => PermissionsService.canDeleteRecord(projectModel, item),
          icon: 'times',
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='items'
        columns={columns}
        key={view}
        onDelete={(item) => ItemsService.delete(item)}
        onLoad={(params) => (
          ItemsService
            .fetchAll({ ...params, project_model_id: projectModelId, view })
            .finally(() => WindowUtils.scrollToTop())
        )}
        searchable
        session={{
          key: `items_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Items;
