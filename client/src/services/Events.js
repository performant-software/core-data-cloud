// @flow

import EventTransform from '../transforms/Event';
import MergeableService from './Mergeable';

/**
 * Class responsible for handling all event API requests.
 */
class Events extends MergeableService {
  /**
   * Returns the event base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/events';
  }

  /**
   * Returns the event transform object.
   *
   * @returns {EventTransform}
   */
  getTransform(): typeof EventTransform {
    return EventTransform;
  }
}

const EventsService: Events = new Events();
export default EventsService;
