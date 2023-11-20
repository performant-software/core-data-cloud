// @flow

import { useContext, useEffect } from 'react';
import CurrentRecordContext from '../context/CurrentRecord';
import useParams from './ParsedParams';

const initialize = ({ item, onSetState }) => {
  const { setCurrentRecord } = useContext(CurrentRecordContext);
  const { projectModelId } = useParams();

  /**
   * Sets the project model ID on the state from the route parameters.
   */
  useEffect(() => {
    if (onSetState && !item.id) {
      onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, item.id]);

  /**
   * Sets the current record on the context.
   */
  useEffect(() => setCurrentRecord(item), [item]);
};

export default initialize;
