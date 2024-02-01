// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import { FileInputButton } from '@performant-software/semantic-components';
import cx from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Menu, Modal } from 'semantic-ui-react';
import type { PlaceLayer as PlaceLayerType } from '../types/Place';
import PlaceLayerUtils from '../utils/PlaceLayers';
import styles from './PlaceLayerModal.module.css';

type Props = EditContainerProps & {
  item: PlaceLayerType
};

const { LayerTypes } = PlaceLayerUtils;

const Tabs = {
  url: 0,
  file: 1
};

const PlaceLayerModal: AbstractComponent<any> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(props.item.geometry ? Tabs.file : Tabs.url);

  const { t } = useTranslation();

  /**
   * Sets a memo-ized version of the parsed and formatted GeoJSON.
   *
   * @type {string}
   */
  const geometry = useMemo(() => (
    JSON.stringify(JSON.parse(props.item.geometry || '{}'), null, 2)
  ), [props.item.geometry]);

  /**
   * Sets the uploaded file as the GeoJSON object.
   *
   * @type {(function([*]): void)|*}
   */
  const onUpload = useCallback(([file]) => {
    setLoading(true);

    file.text()
      .then((value) => props.onSetState({ geometry: value, url: null }))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Sets the geometry to the passed value and clears the URL.
   *
   * @type {(function(*, {value: *}): void)|*}
   */
  const onGeometryChange = useCallback((e, { value }) => {
    props.onSetState({ url: null, geometry: value });
  }, []);

  /**
   * Sets the URL to the passed value and clears the geometry.
   *
   * @type {(function(*, {value: *}): void)|*}
   */
  const onUrlChange = useCallback((e, { value }) => {
    props.onSetState({ url: value, geometry: null });
  }, []);

  /**
   * Set the default layer type on the state for a new record.
   */
  useEffect(() => {
    if (!props.item.layer_type) {
      props.onSetState({ layer_type: LayerTypes.geojson });
    }
  }, []);

  return (
    <Modal
      as={Form}
      centered={false}
      className={styles.placeLayerModal}
      noValidate
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('PlaceLayerModal.title.edit')
          : t('PlaceLayerModal.title.add')}
      />
      <Modal.Content
        className={styles.content}
      >
        <Form.Input
          autoFocus
          error={props.isError('name')}
          label={t('PlaceLayerModal.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
        <Form.Dropdown
          label={t('PlaceLayerModal.labels.type')}
          required
          onChange={props.onTextInputChange.bind(this, 'layer_type')}
          options={PlaceLayerUtils.getLayerTypeOptions()}
          selection
          value={props.item.layer_type}
        />
        { props.item.layer_type === LayerTypes.geojson && (
          <>
            <Menu
              secondary
            >
              <Menu.Item
                active={tab === Tabs.url}
                content={t('PlaceLayerModal.tabs.url')}
                onClick={() => setTab(Tabs.url)}
              />
              <Menu.Item
                active={tab === Tabs.file}
                content={t('PlaceLayerModal.tabs.file')}
                onClick={() => setTab(Tabs.file)}
              />
            </Menu>
            { tab === Tabs.url && (
              <Form.Input
                error={props.isError('url')}
                label={t('PlaceLayerModal.labels.url')}
                required
                onChange={onUrlChange}
                value={props.item.url}
              />
            )}
            { tab === Tabs.file && (
              <>
                <FileInputButton
                  className={cx(styles.ui, styles.button, styles.uploadButton)}
                  color='dark gray'
                  content={t('Common.buttons.upload')}
                  disabled={loading}
                  icon='upload'
                  loading={loading}
                  onSelection={onUpload}
                />
                <Form.TextArea
                  error={props.isError('geometry')}
                  label={t('PlaceLayerModal.labels.geometry')}
                  required
                  onChange={onGeometryChange}
                  value={geometry}
                />
              </>
            )}
          </>
        )}
        { props.item.layer_type === LayerTypes.raster && (
          <Form.Input
            error={props.isError('url')}
            label={t('PlaceLayerModal.labels.url')}
            required
            onChange={props.onTextInputChange.bind(this, 'url')}
            value={props.item.url}
          />
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default PlaceLayerModal;
