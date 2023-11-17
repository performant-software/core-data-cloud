// @flow

import { BaseService } from '@performant-software/shared-components';
import SourceTitleTransform from '../transforms/SourceTitles';

/**
 * Class responsible for handling all work API requests.
 */
class SourceTitles extends BaseService {
  /**
   * Returns the source title base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/source_titles';
  }

  /**
   * Returns the source title transform object.
   *
   * @returns {SourceTitleTransform}
   */
  getTransform(): typeof SourceTitleTransform {
    return SourceTitleTransform;
  }
}

const SourceTitlesService: SourceTitles = new SourceTitles();
export default SourceTitlesService;
