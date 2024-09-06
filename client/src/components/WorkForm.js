// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import SourceNameModal from './SourceNameModal';
import type { Work as WorkType } from '../types/Work';

type Props = EditContainerProps & {
  item: WorkType
};

const WorkForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Header
        content={t('WorkForm.labels.names')}
        size='tiny'
      />
      <EmbeddedList
        actions={[{
          name: 'edit',
          icon: 'pencil'
        }, {
          name: 'delete',
          icon: 'times'
        }]}
        addButton={{
          basic: false,
          color: 'dark gray',
          content: t('Common.buttons.addName'),
          location: 'bottom'
        }}
        className='compact'
        columns={[{
          name: 'name',
          label: t('WorkForm.workNames.columns.name')
        }, {
          name: 'primary',
          label: t('WorkForm.workNames.columns.primary'),
          render: (sourceName) => <BooleanIcon value={sourceName.primary} />
        }]}
        configurable={false}
        items={props.item.source_names}
        modal={{
          component: SourceNameModal
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'source_names')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'source_names')}
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
    </Form>
  );
};

export default WorkForm;
