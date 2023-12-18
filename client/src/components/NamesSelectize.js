// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import { Selectize } from '@performant-software/semantic-components';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Name as NameType } from '../types/Name';
import NamesService from '../services/Names';
import NameModal from './NameModal';
import useParams from '../hooks/ParsedParams';

type Props = EditContainerProps & {
  idsToFilter?: Array<number>,
  onClose: () => void,
  onSetName: (items: Array<NameType>) => any,
  projectId: number,
  projectModelId: number
};

const NamesSelectize = (props: Props) => {
  const { t } = useTranslation();

  const newName = useRef<NameType | null>(null);
  const { projectId } = useParams();

  // Really hacky way of inserting a new name that's been
  // created through the modal. Since we can't directly
  // create names, we sort of fake its creation by
  // adding it to the list and updating state on the parent.
  const onLoad = useCallback((params) => (
    NamesService
      .fetchAll({
        ...params,
        project_id: projectId
      })
      .then((res) => {
        let newData = res.data?.names;
        if (newData && newName.current) {
          newData.push(newName.current);
        }

        // Also, filter any names that are already associated.
        // (maybe there's a better way to do this through the API??)
        if (props.idsToFilter) {
          newData = newData.filter((name) => !props.idsToFilter.includes(name.id));
        }

        newName.current = null;
        return {
          ...res,
          data: {
            ...res.data,
            names: newData
          }
        };
      })
  ), [props.projectModelId]);

  return (
    <div>
      <Selectize
        collectionName='names'
        modal={{
          component: NameModal,
          onSave: (name: NameType) => (
            new Promise((resolve) => {
              newName.current = { ...name };
              resolve(name);
            })
          )
        }}
        multiple={false}
        onClose={props.onClose}
        onLoad={onLoad}
        onSave={(data) => {
          props.onSetName(data);
          props.onClose();
        }}
        renderItem={(item) => item.name}
        title={t('NamesSelectize.title')}
      />
    </div>
  );
};

export default NamesSelectize;
