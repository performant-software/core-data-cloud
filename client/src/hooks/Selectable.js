// @flow

import { useCallback, useState } from 'react';
import _ from 'underscore';

const useSelectable = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  /**
   * Returns true if the passed item is in the list of selected items.
   *
   * @type {function(*): *}
   */
  const isSelected = useCallback((item) => _.contains(selectedItems, item.id), [selectedItems]);

  /**
   * Removes the passed item from the list of selected items if selected. Adds the passed item to the list of selected
   * items if not selected.
   *
   * @type {(function(*=): void)|*}
   */
  const onRowSelect = useCallback((item) => {
    if (isSelected(item)) {
      setSelectedItems((prevItems) => _.filter(prevItems, (id) => id !== item.id));
    } else {
      setSelectedItems((prevItems) => ([...prevItems, item.id]));
    }
  }, [selectedItems]);

  return {
    isSelected,
    onRowSelect,
    selectedItems
  };
};

export default useSelectable;
