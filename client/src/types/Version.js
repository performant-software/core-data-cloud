// @flow

import type { User } from './User';

export type Version = {
  id: number,
  uuid: string,
  event: 'create' | 'update' | 'destroy',
  item_id: number,
  request_uuid: string,
  created_at: string,
  root_id: number,
  user: User,
  record_type: string,
  root_record_type: string,
  attributes: {
    [string]: any
  },
  user_defined: {
    "uuid": string,
    "label": string,
    "data_type": string,
    "from": any,
    "to": any
  }[],
  metadata: {
    [string]: any
  },
  root_display_name: string,
  root_uuid: string,
  root_project_model_id: number
}
