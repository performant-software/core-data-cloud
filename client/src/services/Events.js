// @flow

import BaseService from './Base';
import EventTransform from '../transforms/Event';

/**
 * Class responsible for handling all event API requests.
 */
class Events extends BaseService {
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
