// @flow

import cx from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCircleDashed } from 'react-icons/tb';
import { MapControl } from '@performant-software/geospatial';
import styles from './MapCertaintyControl.module.css';

type Props = {
  data: any,
  onChange: (data: any) => void
};

const MapCertaintyControl = (props: Props) => {
  const { t } = useTranslation();
  const [showCertaintyRadiusInput, setShowCertaintyRadiusInput] = useState(false);

  const certaintyRadius = useMemo(() => (
    props.data?.certainty_radius || 0
  ), [props.data]);

  const onCertaintyRadiusChange = useCallback((e) => {
    const radius = parseFloat(e.target.value) || 0;

    props.onChange({
      ...props.data,
      certainty_radius: radius
    });
  }, [props.data, props.onChange]);

  return (
    <MapControl
      position='bottom-left'
    >
      <div className={styles.certaintyRadiusControl}>
        <button
          className={cx(
            'mapbox-gl-draw_ctrl-draw-btn',
            'layer-button'
          )}
          onClick={() => setShowCertaintyRadiusInput(!showCertaintyRadiusInput)}
          title={t('PlaceForm.labels.certaintyRadius')}
          type='button'
        >
          <TbCircleDashed />
        </button>
        { showCertaintyRadiusInput && (
          <div
            className={cx(
              styles.certaintyRadiusInputContainer,
              'mapbox-gl-draw_ctrl-draw-btn'
            )}
          >
            <input
              className='ui input'
              type='number'
              value={certaintyRadius}
              min={0}
              step={0.01}
              onChange={onCertaintyRadiusChange}
            />
          </div>
        )}
      </div>
    </MapControl>
  );
};

export default MapCertaintyControl;
