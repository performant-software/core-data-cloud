// @flow

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { forwardRef, useImperativeHandle } from 'react';
import { useControl, type ControlPosition, type MapRef } from 'react-map-gl';

type Props = {
  position?: ControlPosition;
  onCreate?: (evt: { features: Array<any> }) => void;
  onUpdate?: (evt: { features: Array<any>, action: string }) => void;
  onDelete?: (evt: { features: Array<any> }) => void;
};

const DrawControl = forwardRef((props: Props, ref) => {
  /**
   * Creates the drawer ref using MapboxDraw.
   */
  const drawRef = useControl(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position
    }
  );

  /**
   * Exposes the ref for the MapboxDraw object.
   */
  useImperativeHandle(ref, () => drawRef, [drawRef]);

  return null;
});

export default DrawControl;
