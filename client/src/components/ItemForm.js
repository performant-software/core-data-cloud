// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  Header,
  Popup
} from 'semantic-ui-react';
import ImportModal from './ImportModal';
import type { Item as ItemType } from '../types/Item';
import NameRelationModal from './NameRelationModal';
import ProjectContext from '../context/Project';
import type { SourceTitle as SourceTitleType } from '../types/Source';
import SourcesUtils from '../utils/Sources';

type Props = EditContainerProps & {
  item: ItemType
};

const ItemForm = (props: Props) => {
  const [modal, setModal] = useState(false);

  const { project, projectModel } = useContext(ProjectContext);
  const { t } = useTranslation();

  return (
    <Form>
      <Header
        content={t('ItemForm.labels.names')}
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
          label: t('ItemForm.itemNames.columns.name'),
          resolve: (sourceTitle) => sourceTitle.name.name
        }, {
          name: 'primary',
          label: t('ItemForm.itemNames.columns.primary'),
          render: (sourceTitle) => <BooleanIcon value={sourceTitle.primary} />
        }]}
        configurable={false}
        items={props.item.source_titles}
        modal={{
          component: NameRelationModal,
          onSave: (sourceTitle: SourceTitleType) => SourcesUtils.insertSourceTitle(props, sourceTitle)
        }}
        onSave={props.onSaveChildAssociation.bind(this, 'source_titles')}
        onDelete={props.onDeleteChildAssociation.bind(this, 'source_titles')}
      />
      { projectModel.id === project.faircopy_cloud_project_model_id && (
        <Form.Input
          error={props.isError('faircopy_cloud_id')}
          fluid
          label={t('ItemForm.labels.faircopyCloudId')}
          required={props.isRequired('faircopy_cloud_id')}
          onChange={props.onTextInputChange.bind(this, 'faircopy_cloud_id')}
          value={props.item.faircopy_cloud_id}
        >
          <input />
          <Popup
            content={t('ItemForm.actions.import.content')}
            header={t('ItemForm.actions.import.header')}
            trigger={(
              <Button
                disabled={!props.item.id}
                icon='cloud download'
                onClick={() => setModal(true)}
                style={{
                  marginLeft: '1em'
                }}
              />
            )}
          />
        </Form.Input>
      )}
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
      { modal && (
        <ImportModal
          id={props.item.id}
          onClose={() => setModal(false)}
          title={props.item.faircopy_cloud_id}
        />
      )}
    </Form>
  );
};

export default ItemForm;
