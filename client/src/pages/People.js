// @flow

import { ListTable } from '@performant-software/semantic-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import PeopleService from '../services/People';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import Views from '../constants/ListViews';
import useParams from '../hooks/ParsedParams';
import WindowUtils from '../utils/Window';

const People: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the people columns.
   */
  const columns = useMemo(() => [{
    name: 'last_name',
    label: t('People.columns.lastName'),
    sortable: true
  }, {
    name: 'first_name',
    label: t('People.columns.firstName'),
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
              <FaUsers />
            </Icon>
          ),
          owned: (
            <Icon>
              <FaUsers />
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
          onClick: (person) => navigate(`${person.id}`)
        }, {
          accept: (person) => PermissionsService.canDeleteRecord(projectModel, person),
          icon: 'times',
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='people'
        columns={columns}
        key={view}
        onDelete={(place) => PeopleService.delete(place)}
        onLoad={(params) => (
          PeopleService
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
        session={{
          key: `people_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default People;
