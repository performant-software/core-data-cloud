// @flow

import { BaseService } from '@performant-software/shared-components';
import MediaContentTransform from '../transforms/MediaContent';

/**
 * Class responsible for handling all media contents API requests.
 */
class MediaContents extends BaseService {
  /**
   * Returns the media contents base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/media_contents';
  }

  /**
   * Returns the media contents transform object.
   *
   * @returns {MediaContentTransform}
   */
  getTransform() {
    return MediaContentTransform;
  }
}

const MediaContentsService: MediaContents = new MediaContents();
export default MediaContentsService;
