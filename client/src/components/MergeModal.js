// @flow

import { BooleanIcon } from '@performant-software/semantic-components';
import { Date as DateUtils } from '@performant-software/shared-components';
import { DataTypes, UserDefinedFieldsService } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Label,
  Loader,
  Message,
  Modal
} from 'semantic-ui-react';
import _ from 'underscore';
import MergeTable from './MergeTable';
import styles from './MergeModal.module.css';

type MergeAttributeType = {
  name: string,
  label: string,
  array?: boolean,
  names?: boolean,
  onSelection?: (item: any) => any,
  resolve: (any) => Element | string
};

type Props = {
  attributes: Array<MergeAttributeType>,
  errors?: Array<string>,
  ids: Array<number>,
  onClose: () => void,
  onLoad: (id: number) => Promise<any>,
  onSave: () => void,
  projectModelId: number,
  saving?: boolean,
  title: string
};

const MergeModal = (props: Props) => {
  const [attributes, setAttributes] = useState(props.attributes || []);
  const [items, setItems] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [record, setRecord] = useState({});
  const [userDefinedFields, setUserDefinedFields] = useState([]);

  const { t } = useTranslation();

  /**
   * Memo-izes the list of items and adds a label to each.
   */
  const itemsWithLabels = useMemo(() => _.map(items, (i, index) => ({
    ...i,
    label: t('MergeModal.labels.record', { index: index + 1 })
  })), [items]);

  /**
   * Returns the attribute value for the passed item/attribute.
   *
   * @type {function(*, *, *): *}
   */
  const getAttributeValue = useCallback((current, item, attribute) => {
    let value = item[attribute.name];

    if (attribute.names) {
      value = _.map(value, (entry) => ({
        ...entry,
        primary: !_.findWhere(current[attribute.name], { primary: true }) && entry.primary
      }));
    }

    if (attribute.array) {
      value = [
        ...(current[attribute.name] || []),
        ...(value || [])
      ];
    }

    if (attribute.name === 'user_defined') {
      const { field } = attribute;

      value = {
        ...(current.user_defined || {}),
        [field.uuid]: value[field.uuid]
      };
    }

    return value;
  }, []);

  /**
   * Adds the value for the passed attribute to the merge record.
   * @type {(function(*, *): void)|*}
   */
  const onAttributeSelection = useCallback((item, attribute) => {
    // If the attribute provides an "onSelection" prop, append the result of the callback to the state
    if (attribute.onSelection) {
      setRecord({ ...record, ...attribute.onSelection(item) });
      return;
    }

    const value = getAttributeValue(record, item, attribute);
    setRecord({ ...record, [attribute.name]: value });
  }, [getAttributeValue, record]);

  /**
   * Resets the merge record.
   *
   * @type {function(): void}
   */
  const onClear = useCallback(() => setRecord({}), []);

  /**
   * Clears the passed attribute from the merge record.
   *
   * @type {(function(*): void)|*}
   */
  const onClearAttribute = useCallback((attribute) => {
    // If the attribute specifies an "onRemove" prop, append the result of the callback to the state
    if (attribute.onRemove) {
      setRecord((prevRecord) => ({ ...prevRecord, ...attribute.onRemove() }));
      return;
    }

    let value = null;

    if (attribute.name === 'user_defined') {
      const { field } = attribute;
      value = _.omit(record[attribute.name], field.uuid);
    }

    setRecord((prevRecord) => ({
      ...prevRecord,
      [attribute.name]: value
    }));
  }, [record]);

  /**
   * Removes the item from the passed index of the array.
   *
   * @type {(function(*, *): void)|*}
   */
  const onRemoveArrayItem = useCallback((attribute, index) => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      [attribute.name]: _.filter(prevRecord[attribute.name], (i, idx) => idx !== index)
    }));
  }, []);

  /**
   * Removes the passed user-defined field attribute from the merge record.
   *
   * @type {function(*, *): void}
   */
  const onRemoveUserDefinedAttribute = useCallback((field, value) => (
    setRecord((prevRecord) => ({
      ...prevRecord,
      user_defined: {
        ...prevRecord.user_defined || {},
        [field.uuid]: _.without(prevRecord.user_defined[field.uuid], value)
      }
    }))
  ), [record]);

  /**
   * Selects the passed record as the merge record.
   *
   * @type {function(*): void}
   */
  const onSelect = useCallback((item) => {
    const newRecord = {};

    _.each(attributes, (attribute) => {
      if (attribute.onSelection) {
        _.extend(newRecord, attribute.onSelection(item));
      } else {
        const value = getAttributeValue(newRecord, item, attribute);
        _.extend(newRecord, { [attribute.name]: value });
      }
    });

    setRecord(newRecord);
  }, [attributes, getAttributeValue]);

  /**
   * Toggles the primary indicator for the record at the passed index.
   *
   * @type {function(*, *): void}
   */
  const onTogglePrimary = useCallback((attribute, index) => setRecord((prevRecord) => ({
    ...prevRecord,
    [attribute.name]: _.map(
      prevRecord[attribute.name],
      (entry, idx) => (index === idx ? ({ ...entry, primary: !entry.primary }) : entry)
    )
  })), []);

  /**
   * Renders the user-defined field value for the passed item.
   *
   * @type {(function(*, *, boolean=): (*))|*}
   */
  const renderUserDefined = useCallback((item, field, editable = false) => {
    const value = item.user_defined && item.user_defined[field.uuid];

    if (_.isBoolean(value) && field.data_type === DataTypes.boolean) {
      return (
        <BooleanIcon
          value={value}
        />
      );
    }

    if (field.data_type === DataTypes.date) {
      return value && DateUtils.formatDate(value);
    }

    if (field.data_type === DataTypes.select && field.allow_multiple) {
      return _.map(value, (entry) => (
        <Label
          className={cx(styles.ui, styles.label)}
          content={entry}
          onRemove={editable ? onRemoveUserDefinedAttribute.bind(this, field, entry) : undefined}
        />
      ));
    }

    if (value && field.data_type === DataTypes.richText) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: value
          }}
        />
      );
    }

    return value;
  }, []);

  /**
   * Renders the value for the passed item/attribute.
   *
   * @type {(function(*, *, boolean=): (*))|*}
   */
  const renderValue = useCallback((item, attribute, editable = false) => {
    const value = (item || {})[attribute.name];

    if (attribute.array && attribute.resolve) {
      return _.map(value, (entry, index) => (
        <Label
          className={cx(styles.ui, styles.label, attribute.names && editable ? styles.selectable : undefined)}
          color={attribute.names && entry.primary ? 'green' : undefined}
          content={attribute.resolve(entry)}
          icon={attribute.names && entry.primary ? 'checkmark' : undefined}
          onClick={attribute.names && editable ? onTogglePrimary.bind(this, attribute, index) : undefined}
          onRemove={editable ? onRemoveArrayItem.bind(this, attribute, index) : undefined}
        />
      ));
    }

    if (attribute.name === 'user_defined' && attribute.field) {
      return renderUserDefined(item, attribute.field, editable);
    }

    if (attribute.resolve) {
      return attribute.resolve(item);
    }

    return value;
  }, [onTogglePrimary, renderUserDefined]);

  /**
   * Loads the records to be merged.
   */
  useEffect(() => {
    const loaders = _.map(props.ids, (id) => props.onLoad(id));
    setLoadingRecords(true);

    Promise
      .all(loaders)
      .then((data) => setItems(data))
      .finally(() => setLoadingRecords(false));
  }, [props.ids, props.onLoad]);

  /**
   * Loads the user-defined fields for the passed project model ID.
   */
  useEffect(() => {
    setLoadingFields(true);

    UserDefinedFieldsService
      .fetchAll({ defineable_id: props.projectModelId, defineable_type: 'CoreDataConnector::ProjectModel' })
      .then(({ data }) => setUserDefinedFields(data.user_defined_fields))
      .finally(() => setLoadingFields(false));
  }, [props.projectModelId]);

  /**
   * Sets the user-defined attributes on the state.
   */
  useEffect(() => {
    const attrs = [];

    _.each(userDefinedFields, (field) => {
      attrs.push({
        name: 'user_defined',
        label: field.column_name,
        field,
      });
    });

    setAttributes((prevAttributes) => [...prevAttributes, ...attrs]);
  }, [userDefinedFields]);

  return (
    <Modal
      centered={false}
      className={cx(
        styles.mergeModal,
        styles.ui,
        styles.modal
      )}
      open
    >
      <Modal.Header
        content={props.title}
      />
      <Modal.Content>
        { !_.isEmpty(props.errors) && (
          <Message
            header={t('MergeModal.errors.header')}
            list={props.errors}
            negative
          />
        )}
        { (loadingFields || loadingRecords) && (
          <Loader />
        )}
        { !(loadingFields || loadingRecords) && (
          <MergeTable
            attributes={attributes}
            item={record}
            items={itemsWithLabels}
            label={t('MergeModal.labels.mergedRecord')}
            onAttributeSelection={onAttributeSelection}
            onClear={onClear}
            onClearAttribute={onClearAttribute}
            onSelect={onSelect}
            renderValue={renderValue}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={props.saving}
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
        <Button
          content={t('MergeModal.buttons.merge')}
          disabled={props.saving}
          loading={props.saving}
          onClick={() => props.onSave({ ...record, project_model_id: props.projectModelId })}
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

export default MergeModal;

export type {
  MergeAttributeType
};
