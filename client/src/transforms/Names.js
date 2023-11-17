// @flow

import { BaseTransform } from '@performant-software/shared-components';
import NameType from '../types/Name';

/**
 * Class responsible for transforming place names objects.
 */
class Names extends BaseTransform {
  /**
   * Returns the media content parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'name';
  }

  /**
   * Returns the name payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'name',
      '_destroy'
    ];
  }

  /**
   * Returns the passed name as a dropdown option.
   *
   * @param name
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(name: NameType) {
    return {
      key: name.id,
      value: name.id,
      text: name.name
    };
  }
}

const NamesTransform: Names = new Names();
export default NamesTransform;
