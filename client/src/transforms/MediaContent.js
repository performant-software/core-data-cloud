// @flow

import { Attachments, FormDataTransform } from '@performant-software/shared-components';
import type { MediaContent as MediaContentType } from '../types/MediaContent';

/**
 * Class responsible for transforming media content records for POST/PUT requests.
 */
class MediaContent extends FormDataTransform {
  /**
   * Returns the media content parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'media_content';
  }

  /**
   * Returns the list of media content payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'project_model_id',
      'name'
    ];
  }

  /**
   * Appends the media object to the form data.
   *
   * @param mediaContent
   *
   * @returns {*}
   */
  toPayload(mediaContent: MediaContentType): FormData {
    const formData = super.toPayload(mediaContent);
    Attachments.toPayload(formData, this.getParameterName(), mediaContent, 'content');

    return formData;
  }
}

const MediaContentTransform: MediaContent = new MediaContent();
export default MediaContentTransform;
