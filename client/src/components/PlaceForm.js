// @flow

import { MapDraw } from '@performant-software/geospatial';
import { BooleanIcon, EmbeddedList, FileInputButton } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import type { Place as PlaceType } from '../types/Place';
import PlaceNameModal from './PlaceNameModal';
import styles from './PlaceForm.module.css';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceForm = (props: Props) => {
  const { t } = useTranslation();

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
          label: t('PlaceForm.placeNames.columns.name')
        }, {
          name: 'primary',
          label: t('PlaceForm.placeNames.columns.primary'),
          render: (placeName) => <BooleanIcon value={placeName.primary} />
        }]}
        items={props.item.place_names}
        modal={{
          component: PlaceNameModal
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'place_names')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'place_names')}
      />
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
    </Form>
  );
};

export default PlaceForm;
