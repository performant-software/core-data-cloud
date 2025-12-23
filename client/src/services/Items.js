// @flow

import BaseService from './Base';
import Importable from '../transforms/Importable';
import ItemTransform from '../transforms/Item';

/**
 * Class responsible for handling all item API requests.
 */
class Items extends BaseService {
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

  /**
   * Calls the `/items/:id/import` API endpoint for the passed payload.
   *
   * @param id
   * @param files
   *
   * @returns {*}
   */
  import(id: number, files: any) {
    const config = this.getConfig();
    const payload = Importable.toImport(files);

    return this.getAxios().post(`${this.getBaseUrl()}/${id}/import`, payload, config);
  }
}

const ItemsService: Items = new Items();
export default ItemsService;
