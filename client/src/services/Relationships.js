// @flow

import { BaseService } from '@performant-software/shared-components';
import RelationshipTransform from '../transforms/Relationship';
import type { Relationship as RelationshipType } from '../types/Relationship';

/**
 * Class responsible for handling all relationship API requests.
 */
class Relationships extends BaseService {
  /**
   * Returns the relationships base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/relationships';
  }

  /**
   * Returns the relationship transform.
   *
   * @returns {Relationship}
   */
  getTransform() {
    return RelationshipTransform;
  }

  /**
   * Uploads the passed collection of relationships to the /upload API endpoint.
   *
   * @param relationships
   *
   * @returns {*}
   */
  upload(relationships: Array<RelationshipType>) {
    const url = `${this.getBaseUrl()}/upload`;
    const transform = this.getTransform();
    const payload = transform.toUpload(relationships);

    return this.getAxios().post(url, payload, this.getConfig());
  }
}

const RelationshipsService: Relationships = new Relationships();
export default RelationshipsService;
