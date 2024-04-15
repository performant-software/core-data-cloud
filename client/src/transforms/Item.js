// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Item as ItemType } from '../types/Item';
import SourceTitles from './SourceTitles';

/**
 * Class responsible for transforming item records for POST/PUT requests.
 */
class Item extends BaseTransform {
  /**
   * Returns the item parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'item';
  }

  /**
   * Returns the item payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): string[] {
    return [
      'project_model_id',
      'user_defined',
      'faircopy_cloud_id'
    ];
  }

  /**
   * Returns the passed item as a dropdown option.
   *
   * @param item
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(item: ItemType) {
    return {
      key: item.id,
      value: item.id,
      text: item.primary_name.name.name
    };
  }

  /**
   * Returns the item for POST/PUT requests as a plain Javascript object.
   *
   * @param item
   *
   * @returns {*}
   */
  toPayload(item: ItemType) {
    const payload = super.toPayload(item, {
      ...SourceTitles.toPayload(item)
    });

    return payload;
  }
}

const ItemTransform: Item = new Item();
export default ItemTransform;
