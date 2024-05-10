// @flow

import { ListTable } from '@performant-software/semantic-components';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import React, { useContext, useState, type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCalendarShare, TbCalendarTime } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import EventsService from '../services/Events';
import ListViewMenu from '../components/ListViewMenu';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Events: AbstractComponent<any> = () => {
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
        collectionName='events'
        columns={[{
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
        }]}
        key={view}
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
        searchable
      />
    </>
  );
};

export default Events;
