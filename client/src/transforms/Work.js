// @flow

import MergeableTransform from './Mergeable';
import SourceNames from './SourceNames';
import type { Work as WorkType } from '../types/Work';

class Work extends MergeableTransform {
  /**
   * Returns the work parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'work';
  }

  /**
   * Returns the work payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): string[] {
    return [
      'project_model_id',
      'user_defined'
    ];
  }

  /**
   * Returns the passed work as a dropdown option.
   *
   * @param work
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(work: WorkType) {
    return {
      key: work.id,
      value: work.id,
      text: work.name
    };
  }

  toPayload(work: WorkType) {
    const payload = super.toPayload(work, {
      ...SourceNames.toPayload(work)
    });

    return payload;
  }
}

const WorkTransform: Work = new Work();
export default WorkTransform;
