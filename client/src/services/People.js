// @flow

import MergeableService from './Mergeable';
import PersonTransform from '../transforms/Person';

/**
 * Class responsible for handling all person API requests.
 */
class People extends MergeableService {
  /**
   * Returns the person base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/people';
  }

  /**
   * Returns the person transform object.
   *
   * @returns {PersonTransform}
   */
  getTransform(): typeof PersonTransform {
    return PersonTransform;
  }
}

const PeopleService: People = new People();
export default PeopleService;
