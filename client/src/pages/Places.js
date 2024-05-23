// @flow

import { ListTable } from '@performant-software/semantic-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useCallback,
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
import MergeButton from '../components/MergeButton';
import PlacesService from '../services/Places';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import useSelectable from '../hooks/Selectable';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Places: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();
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

  /**
   * Renders a string representation of the place geometry for the passed place.
   *
   * @type {unknown}
   */
  const renderPlaceGeometry = useCallback((place) => place.place_geometry?.geometry_json && (
    <pre>
      { JSON.stringify(place.place_geometry?.geometry_json, undefined, 2) }
    </pre>
  ), []);

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
        buttons={[{
          render: () => (
            <MergeButton
              attributes={[{
                name: 'uuid',
                label: t('Common.actions.merge.uuid')
              }, {
                name: 'place_names',
                label: t('Places.actions.merge.names'),
                array: true,
                names: true,
                resolve: (placeName) => placeName.name
              }, {
                name: 'place_layers',
                label: t('Places.actions.merge.layers'),
                array: true,
                resolve: (placeLayer) => placeLayer.name
              }, {
                name: 'place_geometry',
                label: t('Places.actions.merge.geometry'),
                resolve: renderPlaceGeometry
              }]}
              ids={selectedItems}
              onLoad={(id) => (
                PlacesService
                  .fetchOne(id)
                  .then(({ data }) => data.place)
              )}
              onSave={(place) => (
                PlacesService
                  .mergeRecords(place, selectedItems)
                  .then(({ data }) => data.place)
              )}
              projectModelId={projectModelId}
              title={t('Places.actions.merge.title')}
            />
          )
        }]}
        collectionName='places'
        columns={columns}
        isRowSelected={isSelected}
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
        onRowSelect={onRowSelect}
        searchable
        selectable
        session={{
          key: `places_${projectModelId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default Places;
