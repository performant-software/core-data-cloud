// @flow

import { MapDraw } from '@performant-software/geospatial';
import { FileInputButton, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import cx from 'classnames';
import React, { useCallback, type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import initialize from '../hooks/Item';
import type { Place as PlaceType } from '../types/Place';
import PlaceForm from '../components/PlaceForm';
import PlacesService from '../services/Places';
import styles from './Place.module.css';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlacePage = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Set the required foreign keys on the state.
   */
  initialize(props);

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
        <PlaceForm
          {...props}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Place: AbstractComponent<any> = withReactRouterEditPage(PlacePage, {
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
