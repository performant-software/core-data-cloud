// @flow

import { DataTypes } from '@performant-software/user-defined-fields';
import _ from 'underscore';
import BaseTransform from './Base';
import type { Item as ItemType } from '../types/Item';
import SourceNames from './SourceNames';

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
      text: item.name
    };
  }

  /**
   * Transforms the passed payload into an importable payload.
   *
   * @param payload
   *
   * @returns {{files: {}}}
   */
  toImport(payload) {
    const files = {};

    _.each(_.keys(payload), (filename) => {
      const file = payload[filename];
      const { attributes, data, remove_duplicates: removeDuplicates } = file;

      files[filename] = {
        data: _.map(data, (item) => this.toImportItem(item.import, attributes)),
        remove_duplicates: removeDuplicates
      };
    });

    return {
      files
    };
  }

  /**
   * Converts the JSON user-defined fields for the passed item to strings.
   *
   * @param item
   * @param attributes
   *
   * @returns {*}
   */
  toImportItem(item, attributes) {
    const importItem = { ...item };

    _.each(attributes, (attribute) => {
      const { field } = attribute;

      const isJson = (field?.data_type === DataTypes.select
        && field?.allow_multiple)
        || field?.data_type === DataTypes.fuzzyDate;

      if (isJson) {
        let value = importItem[attribute.name];

        if (value) {
          value = JSON.stringify(value);
        }

        importItem[attribute.name] = value;
      }
    });

    return importItem;
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
      ...SourceNames.toPayload(item)
    });

    return payload;
  }
}

const ItemTransform: Item = new Item();
export default ItemTransform;
