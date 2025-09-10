// @flow

import { FuzzyDateTransform } from '@performant-software/shared-components';
import type { Event as EventType } from '../types/Event';
import MergeableTransform from './Mergeable';

/**
 * Class responsible for transforming event records for POST/PUT requests.
 */
class Event extends MergeableTransform {
  /**
   * Returns the event parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'event';
  }

  /**
   * Returns the event payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_model_id',
      'name',
      'description',
      'start_date',
      'end_date',
      'user_defined'
    ];
  }

  /**
   * Returns the passed event item as a dropdown option.
   *
   * @param event
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(event: EventType) {
    return {
      key: event.id,
      value: event.id,
      text: event.name
    };
  }
}

const EventTransform: Event = new Event();
export default EventTransform;
