// @flow

import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { Icon } from 'semantic-ui-react';
import InstancesService from '../services/Instances';
import { IoMdChatbubbles } from 'react-icons/io';
import { ListTable } from '@performant-software/semantic-components';
import ListViewMenu from '../components/ListViewMenu';
import { MdChatBubble } from 'react-icons/md';
import MergeButton from '../components/MergeButton';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import { useNavigate } from 'react-router-dom';
import useParams from '../hooks/ParsedParams';
import useSelectable from '../hooks/Selectable';
import { useTranslation } from 'react-i18next';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Instances: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { t } = useTranslation();

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();
  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the instances columns.
   */
  const columns = useMemo(() => [{
    label: t('Instances.columns.name'),
    name: 'name',
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
        buttons={[{
          render: () => (
            <MergeButton
              attributes={[{
                name: 'uuid',
                label: t('Common.actions.merge.uuid'),
              }, {
                name: 'source_names',
                label: t('Instances.actions.merge.names'),
                array: true,
                names: true,
                resolve: (sourceName) => sourceName.name
              }]}
              ids={selectedItems}
              onLoad={(id) => (
                InstancesService
                  .fetchOne(id)
                  .then(({ data }) => data.instance)
              )}
              onSave={(instance) => (
                InstancesService
                  .mergeRecords(instance, selectedItems)
                  .then(({ data }) => data.instance)
              )}
              projectModelId={projectModelId}
              title={t('Instances.actions.merge.title')}
            />
          )
        }]}
        collectionName='instances'
        columns={columns}
        isRowSelected={isSelected}
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
        onRowSelect={onRowSelect}
        perPageOptions={[10, 25, 50, 100]}
        searchable
        selectable
        session={{
          key: `instances_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Instances;
