// @flow

import React, {
  type AbstractComponent,
  useState,
  useContext
} from 'react';

import { Icon } from 'semantic-ui-react';
import InstancesService from '../services/Instances';
import { IoMdChatbubbles } from 'react-icons/io';
import { ListTable } from '@performant-software/semantic-components';
import ListViewMenu from '../components/ListViewMenu';
import { MdChatBubble } from 'react-icons/md';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WindowUtils from '../utils/Window';

const Instances: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

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
              <IoMdChatbubbles />
            </Icon>
          ),
          owned: (
            <Icon>
              <MdChatBubble />
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
          onClick: (instance) => navigate(`${instance.id}`)
        }, {
          accept: (instance) => PermissionsService.canDeleteRecord(projectModel, instance),
          icon: 'times',
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='instances'
        columns={[{
          label: t('Instances.columns.name'),
          name: 'core_data_connector_names.name',
          resolve: (instance) => instance.primary_name?.name?.name,
          sortable: true
        }, {
          name: 'uuid',
          label: t('Common.columns.uuid'),
          sortable: true,
          hidden: true
        }]}
        key={view}
        onDelete={(instance) => InstancesService.delete(instance)}
        onLoad={(params) => (
          InstancesService
            .fetchAll({
              ...params,
              project_model_id: projectModelId,
              defineable_id: projectModelId,
              defineable_type: 'CoreDataConnector::ProjectModel',
              view
            })
            .finally(() => WindowUtils.scrollToTop())
        )}
        searchable
      />
    </>
  );
};

export default Instances;
