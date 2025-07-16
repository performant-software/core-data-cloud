// @flow

import { ListTable } from '@performant-software/semantic-components';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { TbCalendarShare, TbCalendarTime } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { Icon } from 'semantic-ui-react';
import EventsService from '../services/Events';
import ListViewMenu from '../components/ListViewMenu';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';
import MergeButton from '../components/MergeButton';
import useSelectable from '../hooks/Selectable';

const Events: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();
  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the events columns.
   */
  const columns = useMemo(() => [{
    name: 'name',
    label: t('Events.columns.name'),
    sortable: true
  }, {
    name: 'start_date.start_date',
    label: t('Events.columns.startDate'),
    resolve: (event) => FuzzyDateUtils.getDateView(event.start_date),
    sortable: true
  }, {
    name: 'end_date.start_date',
    label: t('Events.columns.endDate'),
    resolve: (event) => FuzzyDateUtils.getDateView(event.end_date),
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
              <TbCalendarShare />
            </Icon>
          ),
          owned: (
            <Icon>
              <TbCalendarTime />
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
          onClick: (event) => navigate(`${event.id}`)
        }, {
          accept: (event) => PermissionsService.canDeleteRecord(projectModel, event),
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
                name: 'name',
                label: t('Events.actions.merge.name')
              }, {
                name: 'description',
                label: t('Events.actions.merge.description')
              }, {
                name: 'start_date',
                label: t('Events.actions.merge.startDate'),
                resolve: (event) => FuzzyDateUtils.getDateView(event.start_date)
              }, {
                name: 'end_date',
                label: t('Events.actions.merge.endDate'),
                resolve: (event) => FuzzyDateUtils.getDateView(event.end_date)
              }]}
              ids={selectedItems}
              key='merge'
              onLoad={(id) => (
                EventsService
                  .fetchOne(id)
                  .then(({ data }) => data.event)
              )}
              onSave={(event) => (
                EventsService
                  .mergeRecords(event, selectedItems)
                  .then(({ data }) => data.event)
              )}
              projectModelId={projectModelId}
              title={t('Events.actions.merge.title')}
            />
          )
        }]}
        collectionName='events'
        columns={columns}
        key={view}
        isRowSelected={isSelected}
        onDelete={(event) => EventsService.delete(event)}
        onLoad={(params) => (
          EventsService
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
          key: `events_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Events;
