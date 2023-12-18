// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import type { Work as WorkType } from '../types/Work';
import NameRelationModal from './NameRelationModal';
import type { SourceTitle as SourceTitleType } from '../types/Source';
import SourcesUtils from '../utils/Sources';

type Props = EditContainerProps & {
  item: WorkType
};

const WorkForm = (props: Props) => {
  const { t } = useTranslation();

  const sourceTitlesRef = useRef<Array<SourceTitleType>>([]);

  useEffect(() => {
    sourceTitlesRef.current = { ...props.item.source_titles || [] };
  }, [props.item]);

  return (
    <>
      <Header
        content={t('WorkForm.labels.names')}
      />
      <EmbeddedList
        actions={[{
          name: 'edit'
        }, {
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top'
        }}
        columns={[{
          name: 'name',
          label: t('WorkForm.workNames.columns.name'),
          resolve: (sourceTitle) => sourceTitle.name.name
        }, {
          name: 'primary',
          label: t('WorkForm.workNames.columns.primary'),
          render: (sourceTitle) => <BooleanIcon value={sourceTitle.primary} />
        }]}
        items={props.item.source_titles}
        modal={{
          component: NameRelationModal,
          onSave: (sourceTitle: SourceTitleType) => SourcesUtils.insertSourceTitle(props, sourceTitle)
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'source_titles')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'source_titles')}
      />
      { props.item.project_model_id && (
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={props.item.project_model_id}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Work'
        />
      )}
    </>
  );
};

export default WorkForm;
