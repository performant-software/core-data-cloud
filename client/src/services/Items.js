// @flow

import { BaseService } from '@performant-software/shared-components';
import ItemTransform from '../transforms/Item';

/**
 * Class responsible for handling all item API requests.
 */
class Items extends BaseService {
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
