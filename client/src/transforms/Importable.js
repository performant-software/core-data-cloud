// @flow

import _ from 'underscore';
import { DataTypes } from '@performant-software/user-defined-fields';

class Importable {
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
}

export default new Importable();
