// @flow

import {
  GeoJsonLayer,
  LayerMenu,
  MapControl,
  MapDraw,
  RasterLayer,
  WarpedImageLayer
} from '@performant-software/geospatial';
import { BooleanIcon, EmbeddedList, FileInputButton } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header, Icon } from 'semantic-ui-react';
import _ from 'underscore';
import type { Place as PlaceType } from '../types/Place';
import PlaceLayerModal from './PlaceLayerModal';
import PlaceLayerUtils from '../utils/PlaceLayers';
import PlaceNameModal from './PlaceNameModal';
import MapStyleSwitcher from './MapStyleSwitcher';
import { mapStyle, satelliteStyle } from '../constants/MapStyles';
import styles from './PlaceForm.module.css';

type Props = EditContainerProps & {
  item: PlaceType
};

const { LayerTypes } = PlaceLayerUtils;

const PlaceForm = (props: Props) => {
  const { t } = useTranslation();
  const [baseStyle, setBaseStyle] = useState<mapStyle | satelliteStyle>(mapStyle);

  /**
   * Memo-izes the names of the passed place layers.
   */
  const layerNames = useMemo(() => _.pluck(props.item.place_layers, 'name'), [props.item.place_layers]);

  /**
   * Parses the geometry for the passed layers.
   */
  const layers = useMemo(() => _.map(props.item.place_layers, (layer) => ({
    ...layer,
    content: layer.content ? JSON.parse(layer.content) : undefined
  })), [props.item.place_layers]);

  /**
   * Renders the passed layer.
   *
   * @type {(function(*): *)|*}
   */
  const renderLayer = useCallback((layer) => {
    if (layer.layer_type === LayerTypes.geojson) {
      return (
        <GeoJsonLayer
          data={layer.content}
          url={layer.url}
        />
      );
    }

    if (layer.layer_type === LayerTypes.georeference) {
      return (
        <WarpedImageLayer
          id={layer.id}
          manifest={layer.content}
          url={layer.url}
        />
      );
    }

    if (layer.layer_type === LayerTypes.raster) {
      return (
        <RasterLayer
          url={layer.url}
        />
      );
    }

    return null;
  }, []);

  /**
   * Sets the new map geometries on the state.
   *
   * @type {function(*): *}
   */
  const onMapChange = useCallback((data) => props.onSetState({ place_geometry: { geometry_json: data } }), []);

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
    <Form
      className={styles.placeForm}
    >
      <Header
        content={t('PlaceForm.labels.names')}
        size='tiny'
      />
      <EmbeddedList
        actions={[{
          name: 'edit',
          icon: 'pencil'
        }, {
          name: 'delete',
          icon: 'times'
        }]}
        addButton={{
          basic: false,
          color: 'dark gray',
          content: t('Common.buttons.addName'),
          location: 'bottom'
        }}
        className='compact'
        columns={[{
          name: 'name',
          label: t('PlaceForm.placeNames.columns.name')
        }, {
          name: 'primary',
          label: t('PlaceForm.placeNames.columns.primary'),
          render: (placeName) => <BooleanIcon value={placeName.primary} />
        }]}
        configurable={false}
        items={props.item.place_names}
        modal={{
          component: PlaceNameModal
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'place_names')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'place_names')}
      />
      <Header
        content={t('PlaceForm.labels.layers')}
        size='tiny'
      />
      <EmbeddedList
        actions={[{
          name: 'edit'
        }, {
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'dark gray',
          location: 'bottom'
        }}
        className='compact'
        columns={[{
          name: 'name',
          label: t('PlaceForm.placeLayers.columns.name')
        }]}
        configurable={false}
        items={props.item.place_layers}
        modal={{
          component: PlaceLayerModal,
          props: {
            required: ['name'],
            validate: PlaceLayerUtils.validate.bind(this)
          }
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'place_layers')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'place_layers')}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Place'
        />
      )}
      <Header
        content={t('PlaceForm.labels.location')}
        size='tiny'
      />
      <MapDraw
        apiKey={process.env.REACT_APP_MAP_TILER_KEY}
        data={props.item.place_geometry?.geometry_json}
        geocoding='point'
        mapStyle={baseStyle}
        maxPitch={0}
        onChange={onMapChange}
        preserveDrawingBuffer
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
        }}
      >
        <MapControl
          position='bottom-left'
        >
          <FileInputButton
            className={cx(
              'mapbox-gl-draw_ctrl-draw-btn',
              'layer-button',
              styles.ui,
              styles.button,
              styles.uploadButton
            )}
            color='white'
            icon={(
              <Icon
                name='cloud upload'
              />
            )}
            onSelection={onUpload}
          />
        </MapControl>
        <MapControl position='top-right'>
          <MapStyleSwitcher
            baseStyle={baseStyle}
            setBaseStyle={setBaseStyle}
          />
        </MapControl>
        <LayerMenu
          names={layerNames}
        >
          { _.map(layers, renderLayer) }
        </LayerMenu>
      </MapDraw>
    </Form>
  );
};

export default PlaceForm;
