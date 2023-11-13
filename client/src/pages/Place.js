// @flow

import { MapDraw } from '@performant-software/geospatial';
import {
  BooleanIcon,
  EmbeddedList,
  FileInputButton,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import CurrentRecordContext from '../context/CurrentRecord';
import type { Place as PlaceType } from '../types/Place';
import PlaceNameModal from '../components/PlaceNameModal';
import PlacesService from '../services/Places';
import styles from './Place.module.css';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceForm = (props: Props) => {
  const { setCurrentRecord } = useContext(CurrentRecordContext);
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  /**
   * Sets the project model ID on the state from the route parameters.
   */
  useEffect(() => {
    if (!props.item.id) {
      props.onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, props.item.id]);

  /**
   * Sets the current record on the context.
   */
  useEffect(() => setCurrentRecord(props.item), [props.item]);

  /**
   * Sets the uploaded file as the GeoJSON object.
   *
   * @type {(function([*]): void)|*}
   */
  const onUpload = useCallback(([file]) => {
    file.text()
      .then((text) => JSON.parse(text))
      .then((json) => props.onSetState({ place_geometry: { geometry_json: json } }));
  }, []);

  return (
    <SimpleEditPage
      {...props}
      className={styles.place}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <FileInputButton
          className={cx(styles.uploadButton, styles.ui, styles.button)}
          color='blue'
          content={t('Place.buttons.upload')}
          icon='upload'
          onSelection={onUpload}
        />
        <MapDraw
          data={props.item.place_geometry?.geometry_json}
          mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`}
          onChange={(data) => props.onSetState({ place_geometry: { geometry_json: data } })}
          style={{
            marginBottom: '4em'
          }}
        />
        <Header
          content={t('Place.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
          columns={[{
            name: 'name',
            label: t('Place.placeNames.columns.name')
          }, {
            name: 'primary',
            label: t('Place.placeNames.columns.primary'),
            render: (placeName) => <BooleanIcon value={placeName.primary} />
          }]}
          items={props.item.place_names}
          modal={{
            component: PlaceNameModal
          }}
          onSave={props.onSaveChildAssociation.bind(this, 'place_names')}
          onDelete={props.onDeleteChildAssociation.bind(this, 'place_names')}
        />
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelId}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Place'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Place: AbstractComponent<any> = withReactRouterEditPage(PlaceForm, {
  id: 'itemId',
  onInitialize: (id) => (
    PlacesService
      .fetchOne(id)
      .then(({ data }) => data.place)
  ),
  onSave: (place) => (
    PlacesService
      .save(place)
      .then(({ data }) => data.place)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Place;
