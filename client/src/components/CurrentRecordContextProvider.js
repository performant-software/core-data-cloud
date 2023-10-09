// @flow

import React, {
  useCallback,
  useMemo,
  useState,
  type Node
} from 'react';
import _ from 'underscore';
import CurrentRecordContext from '../context/CurrentRecord';
import PeopleUtils from '../utils/People';
import { Types } from '../utils/ProjectModels';

type Props = {
  children: Node
};

const CurrentRecordContextProvider = (props: Props) => {
  const [record, setRecord] = useState();
  const [type, setType] = useState();

  /**
   * Sets the name value based on the record set on the state.
   *
   * @type {*}
   */
  const name = useMemo(() => {
    let recordName;

    if (type === Types.Organization) {
      recordName = _.findWhere(record.organization_names, { primary: true })?.name;
    } else if (type === Types.Person) {
      recordName = PeopleUtils.getNameView(record);
    } else if (type === Types.Place) {
      recordName = _.findWhere(record.place_names, { primary: true })?.name;
    } else {
      recordName = null;
    }

    return recordName;
  }, [record, type]);

  /**
   * Sets the record and item type on the state.
   *
   * @type {(function(*, *): void)|*}
   */
  const setCurrentRecord = useCallback((item, itemType) => {
    setRecord(item);
    setType(itemType);
  }, []);

  /**
   * Memo-izes the value to set on the context.
   *
   * @type {{
   *  setCurrentRecord: (function(*, *): void)|*, name: *,
   *  setType: function(): void, type: unknown, currentRecord: unknown
   * }}
   */
  const value = useMemo(() => ({
    currentRecord: record,
    name,
    setCurrentRecord,
    setType,
    type
  }), [record, name, setCurrentRecord, setType, type]);

  return (
    <CurrentRecordContext.Provider
      value={value}
    >
      { props.children }
    </CurrentRecordContext.Provider>
  );
};

export default CurrentRecordContextProvider;
