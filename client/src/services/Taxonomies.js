// @flow

import MergeableService from './Mergeable';
import TaxonomyTransform from '../transforms/Taxonomy';

/**
 * Class responsible for handling all taxonomy API requests.
 */
class Taxonomies extends MergeableService {
  /**
   * Returns the taxonomy base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/taxonomies';
  }

  /**
   * Returns the taxonomy transform object.
   *
   * @returns {TaxonomyTransform}
   */
  getTransform(): typeof TaxonomyTransform {
    return TaxonomyTransform;
  }
}

const TaxonomiesService: Taxonomies = new Taxonomies();
export default TaxonomiesService;
