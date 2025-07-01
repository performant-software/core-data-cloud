// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  Header,
  Popup
} from 'semantic-ui-react';
import ImportModal from './ImportModal';
import type { Item as ItemType } from '../types/Item';
import ItemLayoutContext from '../context/ItemLayout';
import ItemsService from '../services/Items';
import ProjectContext from '../context/Project';
import SourceNameModal from './SourceNameModal';

type Props = EditContainerProps & {
  item: ItemType
};

const ItemForm = (props: Props) => {
  const [modal, setModal] = useState(false);

  const { setSaved } = useContext(ItemLayoutContext);
  const { project, projectModel } = useContext(ProjectContext);
  const { t } = useTranslation();

  /**
   * Calls the `/core_data/items/:id/import` API endpoint.
   *
   * @type {function(*): *}
   */
  const onImport = useCallback((data) => (
    ItemsService
      .import(props.item.id, data)
      .then(() => setSaved(true))
  ), [props.item]);

  /**
   * Calls the `/core_data/items/:id/analyze_import` API endpoint.
   *
   * @type {function(): *}
   */
  const onLoad = useCallback(() => (
    ItemsService
      .analyzeImport(props.item.id)
  ), [props.item]);

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
          color: 'grey',
          content: t('Common.buttons.addName'),
          location: 'bottom'
        }}
        className='compact'
        columns={[{
          name: 'name',
          label: t('ItemForm.itemNames.columns.name')
        }, {
          name: 'primary',
          label: t('ItemForm.itemNames.columns.primary'),
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
      { projectModel.id === project.faircopy_cloud_project_model_id && (
        <Form.Input
          error={props.isError('faircopy_cloud_id')}
          fluid
          label={t('ItemForm.labels.faircopyCloudId')}
          required={props.isRequired('faircopy_cloud_id')}
          onChange={props.onTextInputChange.bind(this, 'faircopy_cloud_id')}
          value={props.item.faircopy_cloud_id || ''}
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
      { modal && props.item?.id && (
        <ImportModal
          onClose={() => setModal(false)}
          onImport={onImport}
          onLoad={onLoad}
          title={props.item.faircopy_cloud_id}
        />
      )}
    </Form>
  );
};

export default ItemForm;
