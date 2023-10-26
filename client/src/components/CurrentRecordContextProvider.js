// @flow

import React, {
  useMemo,
  useState,
  type Node, useContext
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import _ from 'underscore';
import CurrentRecordContext from '../context/CurrentRecord';
import PeopleUtils from '../utils/People';
import ProjectContext from '../context/Project';
import { Types } from '../utils/ProjectModels';

type Props = {
  children: Node
};

const PATH_NEW = 'new';

const CurrentRecordContextProvider = (props: Props) => {
  const [record, setRecord] = useState();

  const { projectModel } = useContext(ProjectContext);
  const classView = useMemo(() => projectModel?.model_class_view, [projectModel]);

  const { pathname } = useLocation();
  const isNewRecord = useMemo(() => pathname?.endsWith(PATH_NEW), [pathname]);

  const { t } = useTranslation();

  /**
   * Sets the name value based on the record set on the state.
   *
   * @type {*}
   */
  const name = useMemo(() => {
    if (isNewRecord) {
      return t('CurrentRecordContextProvider.labels.new', { name: projectModel?.name_singular });
    }

    if (classView === Types.Organization) {
      return _.findWhere(record.organization_names, { primary: true })?.name;
    }

    if (classView === Types.Person) {
      return PeopleUtils.getNameView(record);
    }

    if (classView === Types.Place) {
      return _.findWhere(record.place_names, { primary: true })?.name;
    }

    return null;
  }, [classView, isNewRecord, record]);

  /**
   * Memo-izes the value to set on the context.
   *
   * @type {{setCurrentRecord: function(): void, name: *, currentRecord: unknown}}
   */
  const value = useMemo(() => ({
    currentRecord: record,
    name,
    isNewRecord,
    setCurrentRecord: setRecord
  }), [record, name, setRecord]);

  return (
    <CurrentRecordContext.Provider
      value={value}
    >
      { props.children }
    </CurrentRecordContext.Provider>
  );
};

export default CurrentRecordContextProvider;
