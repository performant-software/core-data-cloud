// @flow

import { BaseTransform } from '@performant-software/shared-components';
import TaxonomyType from '../types/Taxonomy';

/**
 * Class responsible for transforming taxonomy records for POST/PUT requests.
 */
class Taxonomy extends BaseTransform {
  /**
   * Returns the taxonomy parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'taxonomy';
  }

  /**
   * Returns the taxonomy payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_model_id',
      'name'
    ];
  }

  /**
   * Returns the passed taxonomy item as a dropdown option.
   *
   * @param place
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(taxonomyItem: TaxonomyType) {
    return {
      key: taxonomyItem.id,
      value: taxonomyItem.id,
      text: taxonomyItem.name
    };
  }
}

const TaxonomyTransform: Taxonomy = new Taxonomy();
export default TaxonomyTransform;
