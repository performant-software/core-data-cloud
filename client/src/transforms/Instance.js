// @flow

import type { Instance as InstanceType } from '../types/Instance';
import MergeableTransform from './Mergeable';
import SourceNames from './SourceNames';

/**
 * Class responsible for transforming instance records for POST/PUT requests.
 */
class Instance extends MergeableTransform {
  /**
   * Returns the instance parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'instance';
  }

  /**
   * Returns the instance payload keys.
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
   * Returns the passed instance as a dropdown option.
   *
   * @param instance
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(instance: InstanceType) {
    return {
      key: instance.id,
      value: instance.id,
      text: instance.name
    };
  }

  /**
   * Returns the instance for POST/PUT requests as a plain Javascript object.
   *
   * @param instance
   *
   * @returns {*}
   */
  toPayload(instance: InstanceType) {
    const payload = super.toPayload(instance, {
      ...SourceNames.toPayload(instance)
    });

    return payload;
  }
}

const InstanceTransform: Instance = new Instance();
export default InstanceTransform;
