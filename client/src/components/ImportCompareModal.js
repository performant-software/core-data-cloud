// @flow

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'semantic-ui-react';
import _ from 'underscore';
import MergeTable from './MergeTable';

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
  const [item, setItem] = useState(props.item.import);

  const { t } = useTranslation();

  /**
   * Memo-izes the list of items, adding a label to each.
   *
   * @type {[]}
   */
  const items = useMemo(() => {
    const value = [];

    if (props.item.db) {
      value.push({ ...props.item.db, label: t('ImportCompareModal.labels.existing') });
    }

    if (props.item.duplicates) {
      _.each(props.item.duplicates, (duplicate, idx) => value.push({
        ...duplicate,
        label: t('ImportCompareModal.labels.duplicate', { index: idx + 1 })
      }));
    }

    return value;
  }, [props.item]);

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
          attributes={props.attributes}
          item={item}
          items={items}
          label={t('ImportCompareModal.labels.incoming')}
          onAttributeSelection={onUpdate}
          onClearAttribute={onClear}
          renderValue={(i, attr) => i[attr.name]}
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
