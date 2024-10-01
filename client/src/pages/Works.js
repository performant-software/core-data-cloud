// @flow

import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { ListTable } from '@performant-software/semantic-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { IoBulb, IoBulbOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ListViewMenu from '../components/ListViewMenu';
import MergeButton from '../components/MergeButton';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import useSelectable from '../hooks/Selectable';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';
import WorksService from '../services/Works';

const Works: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();
  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the works columns.
   */
  const columns = useMemo(() => [{
    label: t('Works.columns.name'),
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
              <IoBulb />
            </Icon>
          ),
          owned: (
            <Icon>
              <IoBulbOutline />
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
          onClick: (work) => navigate(`${work.id}`)
        }, {
          accept: (work) => PermissionsService.canDeleteRecord(projectModel, work),
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
                label: t('Works.actions.merge.names'),
                array: true,
                names: true,
                resolve: (sourceName) => sourceName.name
              }]}
              ids={selectedItems}
              onLoad={(id) => (
                WorksService
                  .fetchOne(id)
                  .then(({ data }) => data.work)
              )}
              onSave={(work) => (
                WorksService
                  .mergeRecords(work, selectedItems)
                  .then(({ data }) => data.work)
              )}
              projectModelId={projectModelId}
              title={t('Works.actions.merge.title')}
            />
          )
        }]}
        collectionName='works'
        columns={columns}
        isRowSelected={isSelected}
        key={view}
        onDelete={(work) => WorksService.delete(work)}
        onLoad={(params) => (
          WorksService
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
          key: `works_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Works;
