// @flow

import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import PeopleUtils from '../utils/People';
import { Types } from '../utils/ProjectModels';
import { useLocation } from 'react-router-dom';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';

const PATH_NEW = 'new';

const initialize = ({ item, onSetState }) => {
  const { projectModel } = useContext(ProjectContext);

  const { projectId, projectModelId } = useParams();
  const { projectModelRelationship } = useProjectModelRelationship();

  const { pathname } = useLocation();
  const { t } = useTranslation();

  const classView = useMemo(() => projectModel?.model_class_view, [projectModel]);
  const isNewRecord = useMemo(() => projectModel && pathname?.endsWith(PATH_NEW), [pathname, projectModel]);

  const label = useMemo(() => t('Common.labels.all', { name: projectModel?.name }), [projectModel]);
  const url = useMemo(() => `/projects/${projectId}/${projectModelId}`, [projectId, projectModelId]);

  /**
   * Sets the name value based on the record set on the state.
   *
   * @type {*}
   */
  const name = useMemo(() => {
    if (isNewRecord && !projectModelRelationship) {
      return t('CurrentRecordContextProvider.labels.new', { name: projectModel?.name_singular });
    }

    if (!item) {
      return null;
    }

    if (classView === Types.Event) {
      return item.name;
    }

    if (classView === Types.Instance) {
      return _.findWhere(item.source_names, { primary: true })?.name;
    }

    if (classView === Types.Item) {
      return _.findWhere(item.source_names, { primary: true })?.name;
    }

    if (classView === Types.MediaContent) {
      return item.name;
    }

    if (classView === Types.Organization) {
      return _.findWhere(item.organization_names, { primary: true })?.name;
    }

    if (classView === Types.Person) {
      return PeopleUtils.getNameView(item);
    }

    if (classView === Types.Place) {
      return _.findWhere(item.place_names, { primary: true })?.name;
    }

    if (classView === Types.Taxonomy) {
      return item.name;
    }

    if (classView === Types.Work) {
      return _.findWhere(item.source_names, { primary: true })?.name;
    }

    return null;
  }, [classView, isNewRecord, projectModelRelationship, item]);

  /**
   * Sets the project model ID on the state from the route parameters.
   */
  useEffect(() => {
    if (onSetState && !item.id) {
      onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, item.id]);

  return {
    label,
    name,
    url
  };
};

export default initialize;
