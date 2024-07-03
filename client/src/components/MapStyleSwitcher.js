// @flow

import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { mapStyle, satelliteStyle } from '../constants/MapStyles';
import cx from 'classnames';
import styles from './MapStyleSwitcher.module.css';

type Props = {
  baseStyle: mapStyle | satelliteStyle,
  setBaseStyle: React.Dispatch<React.SetStateAction<mapStyle | satelliteStyle>>
}

const MapStyleSwitcher = ({ baseStyle, setBaseStyle }: Props) => {
  const updateBaseStyle = () => {
    setBaseStyle(baseStyle === mapStyle ? satelliteStyle : mapStyle);
  };

  return (
    <Button
      className={cx(
        'mapbox-gl-draw_ctrl-draw-btn',
        'layer-button',
        'icon',
        styles.ui,
        styles.button,
        styles.styleButton
      )}
      color='white'
      onClick={updateBaseStyle}
    >
      <Icon name={baseStyle === mapStyle ? 'camera' : 'map'} />
    </Button>
  );
};

export default MapStyleSwitcher;
