// @flow

import {
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
      'user_defined',
      'content',
      'content_warning'
    ];
  }

  /**
   * Returns the valid parameters for the create_manifests endpoint.
   *
   * @param params
   *
   * @returns {*}
   */
  toManifestable(params: { [key: string]: any }) {
    return _.pick(params, 'project_model_relationship_id');
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
   * Sets the passed array of media contents on the form data object.
   *
   * @param mediaContents
   *
   * @returns {FormData}
   */
  toUpload(mediaContents: Array<MediaContentType>) {
    const formData = new FormData();

    _.each(mediaContents, (mediaContent, index) => {
      _.each(this.getPayloadKeys(), (key) => {
        FormUtils.setAttribute(formData, `media_contents[${index}]`, mediaContent, key);
      });
    });

    return formData;
  }
}

const MediaContentTransform: MediaContent = new MediaContent();
export default MediaContentTransform;
