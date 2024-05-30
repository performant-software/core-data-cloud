// @flow

import ItemTransform from '../transforms/Item';
import MergeableService from './Mergeable';

/**
 * Class responsible for handling all item API requests.
 */
class Items extends MergeableService {
  /**
   * Calls the `/items/:id/analyze_import` API endpoint.
   *
   * @param id
   *
   * @returns {*}
   */
  analyzeImport(id: number) {
    return this.getAxios().get(`${this.getBaseUrl()}/${id}/analyze_import`);
  }

  /**
   * Returns the item base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/items';
  }

  /**
   * Returns the item transform object.
   *
   * @returns {ItemTransform}
   */
  getTransform(): typeof ItemTransform {
    return ItemTransform;
  }
}

const ItemsService: Items = new Items();
export default ItemsService;
