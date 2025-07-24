// @flow

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router';
import _ from 'underscore';
import ItemLayoutContext from '../context/ItemLayout';
import ProjectContext from '../context/Project';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';

const ERROR_SEPARATOR = '. ';

/**
 * Sets the required foreign keys on the state when creating a primary record from within a relationship.
 *
 * @param item
 * @param onSetState
 */
const initializeRelated = ({ item, onSetState }) => {
  const { projectModelRelationship } = useProjectModelRelationship();

  useEffect(() => {
    if (onSetState && !item.id) {
      onSetState({
        project_model_id: projectModelRelationship.inverse
          ? projectModelRelationship.primary_model_id
          : projectModelRelationship.related_model_id
      });
    }
  }, [item.id, projectModelRelationship]);
};

/**
 * Hook to provide helpers to relationship edit forms.
 *
 * @param props
 *
 * @returns {{
 *  onSave: (function(*): Promise<Awaited<*>>),
 *  foreignObject: (Types.Organization|PackageJson.Person|google.maps.Place),
 *  foreignObjectName: string,
 *  label: string,
 *  foreignKey: string,
 *  onSelection: (function(*): (void|*))
*  }}
 */
const useRelationship = (props) => {
  const [save, setSave] = useState();

  const { projectModel } = useContext(ProjectContext);
  const { setSaved } = useContext(ItemLayoutContext);

  const navigate = useNavigate();
  const { itemId, projectId } = useParams();
  const { projectModelRelationship } = useProjectModelRelationship();

  const {
    item,
    onAssociationInputChange,
    onSave: onRecordSave,
    onSetState
  } = props;

  /**
   * Returns the foreign key for the current relationship.
   *
   * @type {string}
   */
  const foreignKey = useMemo(() => (
    projectModelRelationship.inverse
      ? 'primary_record_id'
      : 'related_record_id'
  ), [projectModelRelationship]);

  /**
   * Returns the foreign object for the current relationship.
   *
   * @type {Organization|Person|Place}
   */
  const foreignObject = useMemo(() => (
    projectModelRelationship.inverse
      ? item.primary_record
      : item.related_record
  ), [item, projectModelRelationship]);

  /**
   * Returns the foreign object name for the current relationship.
   *
   * @type {string}
   */
  const foreignObjectName = useMemo(() => (
    projectModelRelationship.inverse
      ? 'primary_record'
      : 'related_record'
  ), [projectModelRelationship]);

  /**
   * Sets the relationship label as the singular version of the name.
   *
   * @type {string}
   */
  const label = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship.primary_model.name_singular
      : projectModelRelationship.related_model.name_singular
  ), [projectModelRelationship]);

  /**
   * Sets the error value based on the "errors" in the passed props.
   *
   * @type {*}
   */
  const error = useMemo(() => {
    let value;

    if (!_.isEmpty(props.errors)) {
      const content = props.errors.join(ERROR_SEPARATOR);
      value = { content };
    }

    return value;
  }, [props.errors]);

  /**
   * Resets the state with the passed relationship and returns a Promise resolving the related record.
   *
   * @type {function(*): Promise<Awaited<*>>}
   */
  const onSave = useCallback((relationship) => {
    onSetState({ ...relationship });
    return Promise.resolve({ ...relationship[foreignObjectName] });
  }, [foreignObjectName, onSetState]);

  /**
   * Sets the new value on the state.
   *
   * @type {(function(*): void)|*}
   */
  const onChange = useCallback((value) => {
    // Set the new value on the state
    onAssociationInputChange(foreignKey, foreignObjectName, value);

    // Trigger an auto-save
    setSave(true);
  }, [foreignKey, foreignObjectName]);

  /**
   * Deletes the current item.
   *
   * @type {function(): Promise<AxiosResponse<T>>|*}
   */
  const onDelete = useCallback(() => (
    RelationshipsService
      .delete(item)
      .then(() => setSaved(true))
  ), [item]);

  /**
   * Navigates to the record on the other side of the current relationship.
   *
   * @type {(function(): void)|*}
   */
  const onNavigate = useCallback(() => {
    const projectModelId = foreignObject.project_model_id;
    const recordId = foreignObject.id;

    navigate(`/projects/${projectId}/${projectModelId}/${recordId}`);
  }, [foreignObject]);

  /**
   * Calls the onChange or onDelete function based on the passed value.
   *
   * @type {function(*): void|*}
   */
  const onSelection = useCallback((value) => (
    value ? onChange(value) : onDelete()
  ), [onChange, onDelete]);

  /**
   * Sets the available dropdown buttons for the current relationship.
   */
  const buttons = useMemo(() => [{
    accept: () => !!props.item[foreignKey],
    content: null,
    icon: 'pencil',
    name: 'edit'
  }, {
    accept: () => !props.item[foreignKey],
    content: null,
    icon: 'pencil',
    name: 'add'
  }, {
    accept: () => !!props.item[foreignKey],
    content: null,
    name: 'clear'
  }, {
    basic: true,
    icon: 'arrow right',
    name: 'navigate',
    onClick: onNavigate
  }], [foreignKey, onNavigate, props.item]);

  /**
   * Saves the record after a related record has been changed. We only want to do this when the user makes a
   * manual selection on the form.
   */
  useEffect(() => {
    if (save) {
      onRecordSave();
      setSave(false);
    }
  }, [save, onRecordSave]);

  /**
   * Sets the required foreign keys on the state.
   */
  useEffect(() => {
    if (onSetState && !item?.id) {
      if (projectModelRelationship.inverse) {
        onSetState({
          project_model_relationship_id: projectModelRelationship?.id,
          primary_record_type: projectModelRelationship?.primary_model?.model_class,
          related_record_id: itemId,
          related_record_type: projectModel?.model_class
        });
      } else {
        onSetState({
          project_model_relationship_id: projectModelRelationship?.id,
          primary_record_id: itemId,
          primary_record_type: projectModel?.model_class,
          related_record_type: projectModelRelationship?.related_model?.model_class
        });
      }
    }
  }, [item.id, itemId, projectModel, projectModelRelationship]);

  return {
    buttons,
    error,
    foreignKey,
    foreignObject,
    foreignObjectName,
    label,
    onNavigate,
    onSave,
    onSelection
  };
};

export {
  initializeRelated,
  useRelationship
};
