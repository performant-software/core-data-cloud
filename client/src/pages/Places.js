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
import { BiWorld } from 'react-icons/bi';
import { TfiMapAlt } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import PlacesService from '../services/Places';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Places: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the places columns.
   */
  const columns = useMemo(() => [{
    name: 'name',
    label: t('Places.columns.name'),
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
              <BiWorld />
            </Icon>
          ),
          owned: (
            <Icon>
              <TfiMapAlt />
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
          onClick: (place) => navigate(`${place.id}`)
        }, {
          accept: (place) => PermissionsService.canDeleteRecord(projectModel, place),
          icon: 'times',
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='places'
        columns={columns}
        key={view}
        onDelete={(place) => PlacesService.delete(place)}
        onLoad={(params) => (
          PlacesService
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
          key: `places_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Places;
