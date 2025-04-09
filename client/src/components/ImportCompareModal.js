// @flow

import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'semantic-ui-react';
import _ from 'underscore';
import MergeTable from './MergeTable';
import useMergeable from '../hooks/Mergeable';

type Attribute = {
  name: string,
  label: string
};

type Props = {
  attributes: Array<Attribute>,
  item: any,
  onClose: () => void,
  onSave: () => void
};

const ImportCompareModal = (props: Props) => {
  const [item, setItem] = useState(props.item.result);

  const { renderUserDefined } = useMergeable();
  const { t } = useTranslation();

  /**
   * Memo-izes the list of items, adding a label to each.
   *
   * @type {[]}
   */
  const items = useMemo(() => {
    const value = [{
      ...props.item.import,
      label: t('ImportCompareModal.labels.incoming')
    }];

    if (props.item.db) {
      value.push({ ...props.item.db, label: t('ImportCompareModal.labels.existing') });
    }

    if (props.item.duplicates) {
      _.each(props.item.duplicates, (duplicate, idx) => value.push({
        ...duplicate,
        label: t('ImportCompareModal.labels.merged', { index: idx + 1 })
      }));
    }

    return value;
  }, [props.item]);

  /**
   * Memo-izes the attributes and adds a "conflict" property for any where the values conflicts
   * between any of the items.
   *
   * @type {[]}
   */
  const attributes = useMemo(() => _.map(props.attributes, (attribute) => ({
    ...attribute,
    conflict: _.some(items, (i) => !ObjectUtils.isEqual(item[attribute.name], i[attribute.name]))
  })), [item, items, props.attributes]);

  /**
   * Clears the passed attribute from the current item.
   *
   * @type {function(*): void}
   */
  const onClear = useCallback((attribute) => setItem((prevItem) => ({
    ...prevItem,
    [attribute.name]: null
  })), []);

  /**
   * Removes the item at the passed index from the array attribute.
   *
   * @type {function(*, *): void}
   */
  const onRemoveArrayItem = useCallback((attribute, index) => setItem((prevItem) => ({
    ...prevItem,
    [attribute.name]: _.filter(prevItem[attribute.name], (i, idx) => idx !== index)
  })), []);

  /**
   * Calls the onSave prop with the item on the state.
   *
   * @type {function(): *}
   */
  const onSave = useCallback(() => props.onSave(item), [item, props.onSave]);

  /**
   * Updates the current item with the value of the passed attribute from the database item.
   *
   * @type {function(*): void}
   */
  const onUpdate = useCallback((i, attribute) => setItem((prevItem) => ({
    ...prevItem,
    [attribute.name]: i[attribute.name]
  })), [props.item]);

  /**
   * Renders the value for the passed attribute.
   *
   * @type {(function(*, *, *): (*))|*}
   */
  const renderValue = useCallback((i, attribute, editable) => {
    const value = (i || {})[attribute.name];

    if (attribute.name.startsWith('udf')) {
      return renderUserDefined(value, attribute.field, editable, onRemoveArrayItem);
    }

    return value;
  }, []);

  return (
    <Modal
      centered={false}
      open
    >
      <Modal.Header
        content={t('ImportCompareModal.title')}
      />
      <Modal.Content>
        <MergeTable
          attributes={attributes}
          item={item}
          items={items}
          label={t('ImportCompareModal.labels.result')}
          onAttributeSelection={onUpdate}
          onClearAttribute={onClear}
          renderValue={renderValue}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
        <Button
          content={t('Common.buttons.save')}
          onClick={onSave}
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ImportCompareModal;
