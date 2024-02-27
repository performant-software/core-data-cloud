// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import type { PlaceLayer as PlaceLayerType } from '../types/Place';

const EMPTY_JSON = '{}';

const LayerTypes = {
  geojson: 'geojson',
  raster: 'raster'
};

const LayerTypeLabels = {
  [LayerTypes.geojson]: i18n.t('PlaceLayers.labels.geojson'),
  [LayerTypes.raster]: i18n.t('PlaceLayers.labels.raster')
};

/**
 * Returns the label for the passed place layer type.
 *
 * @param placeLayer
 *
 * @returns {*}
 */
const getLayerTypeView = (placeLayer: PlaceLayerType) => LayerTypeLabels[placeLayer?.layer_type];

/**
 * Returns the dropdown options for the place layer type.
 *
 * @returns {*}
 */
const getLayerTypeOptions = () => _.map(_.keys(LayerTypeLabels), (key) => ({
  key,
  value: key,
  text: LayerTypeLabels[key]
}));

/**
 * Validates the passed place layer.
 *
 * @param layer
 *
 * @returns {{}}
 */
const validate = (layer: PlaceLayerType) => {
  const errors = {};

  if (layer.layer_type === LayerTypes.raster && _.isEmpty(layer.url)) {
    _.extend(errors, { url: i18n.t('PlaceLayers.errors.raster') });
  }

  if (layer.layer_type === LayerTypes.geojson) {
    if (_.isEmpty(layer.url) && (_.isEmpty(layer.geometry) || layer.geometry === EMPTY_JSON)) {
      _.extend(errors, { geojson: i18n.t('PlaceLayers.errors.geojson') });
    }

    if (!_.isEmpty(layer.url) && !_.isEmpty(layer.geometry) && layer.geometry !== EMPTY_JSON) {
      _.extend(errors, { geojson: i18n.t('PlaceLayers.errors.geojson') });
    }
  }

  return errors;
};

export default {
  getLayerTypeOptions,
  getLayerTypeView,
  LayerTypeLabels,
  LayerTypes,
  validate
};
