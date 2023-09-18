// @flow

import { BaseService } from '@performant-software/shared-components';
import RelationshipTransform from '../transforms/Relationship';

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
}

const RelationshipsService: Relationships = new Relationships();
export default RelationshipsService;
