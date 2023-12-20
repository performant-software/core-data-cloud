// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import type { Item as ItemType } from '../types/Item';
import NameRelationModal from './NameRelationModal';
import type { SourceTitle as SourceTitleType } from '../types/Source';
import SourcesUtils from '../utils/Sources';

type Props = EditContainerProps & {
  item: ItemType
};

const ItemForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Header
        content={t('ItemForm.labels.names')}
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
          label: t('ItemForm.itemNames.columns.name'),
          resolve: (sourceTitle) => sourceTitle.name.name
        }, {
          name: 'primary',
          label: t('ItemForm.itemNames.columns.primary'),
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
          tableName='CoreDataConnector::Item'
        />
      )}
    </>
  );
};

export default ItemForm;
