// @flow

import {
  Attachments,
  Form as FormUtils,
  FormDataTransform,
  ObjectJs as ObjectUtils
} from '@performant-software/shared-components';
import _ from 'underscore';
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
      'name',
      'user_defined'
    ];
  }

  /**
   * Converts the passed media contents to a mergeable payload by removing any "id" attributes.
   *
   * @param item
   * @param ids
   *
   * @returns {{[p: string]: *, ids: Array<number>}}
   */
  toMergeable(mediaContent: MediaContentType, ids: Array<number>): FormData {
    const formData = this.toPayload(ObjectUtils.without(mediaContent, 'id'));

    // Set the "uuid" value on the form data
    FormUtils.setAttribute(formData, this.getParameterName(), mediaContent, 'uuid');

    // Set the content_url and content_type values on the form data
    FormUtils.setAttribute(formData, this.getParameterName(), mediaContent, 'content_url');
    FormUtils.setAttribute(formData, this.getParameterName(), mediaContent, 'content_type');

    // Append the IDs to the form data
    _.each(ids, (id) => formData.append('ids[]', id));

    return formData;
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
