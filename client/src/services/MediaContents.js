// @flow

import { TripleEyeEffable } from '@performant-software/shared-components';
import MediaContentTransform from '../transforms/MediaContent';
import MergeableService from './Mergeable';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import type { Project as ProjectType } from '../types/Project';
import SessionService from './Session';

/**
 * Class responsible for handling all media contents API requests.
 */
class MediaContents extends MergeableService {
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

  /**
   * Calls the `/core_data/media_contents/upload` API endpoint.
   *
   * @param mediaContents
   *
   * @returns {*}
   */
  upload(mediaContents: Array<MediaContentType>) {
    const url = `${this.getBaseUrl()}/upload`;
    const config = this.getConfig();

    const transform = this.getTransform();
    const payload = transform.toUpload(mediaContents);

    return this.getAxios().post(url, payload, config);
  }

  /**
   * Direct uploads the passed media_content record, then calls the save function.
   *
   * @param mediaContent
   * @param project
   *
   * @returns {Promise<AxiosResponse<T>>}
   */
  uploadOne(mediaContent: MediaContentType, project: ProjectType): Promise<any> {
    const headers = this.getHeaders(project);

    return TripleEyeEffable
      .upload(mediaContent, { headers })
      .then((newMediaContent) => this.save(newMediaContent));
  }

  /**
   * Direct uploads the passed array of media_contents records, then calls the upload function.
   *
   * @param mediaContents
   * @param project
   *
   * @returns {Promise<Awaited<unknown>[]>}
   */
  uploadAll(mediaContents: Array<MediaContentType>, project: ProjectType): Promise<any> {
    const headers = this.getHeaders(project);

    return TripleEyeEffable
      .uploadAll(mediaContents, { headers })
      .then((newMediaContents) => this.upload(newMediaContents));
  }

  // private

  /**
   * Returns the headers to set on the direct upload request.
   *
   * @param project
   *
   * @returns {{}}
   */
  getHeaders(project: ProjectType) {
    const headers = {};

    // Append the session authorization token header to the request
    const { token } = SessionService.getSession();

    if (token) {
      headers['Authorization'] = token;
    }

    // Append the storage key header to the request
    if (project.use_storage_key) {
      headers['X-STORAGE-KEY'] = project.uuid;
    }

    return headers;
  }
}

const MediaContentsService: MediaContents = new MediaContents();
export default MediaContentsService;
