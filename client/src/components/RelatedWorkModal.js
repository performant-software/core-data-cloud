// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import ListViews from '../constants/ListViews';
import ProjectModelRelationshipContext from '../context/ProjectModelRelationship';
import RelatedViewMenu from './RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import WorkModal from './WorkModal';
import WorkTransform from '../transforms/Work';
import WorksService from '../services/Works';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedWorkModal = (props: Props) => {
  const [view, setView] = useState(ListViews.all);

  const { projectModelRelationship } = useContext(ProjectModelRelationshipContext);
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    foreignKey,
    foreignObject,
    foreignObjectName,
    label: name
  } = useRelationship(props);

  const { t } = useTranslation();

  /**
   * Calls the GET API endpoint for works.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    WorksService.fetchAll({
      search,
      project_model_id: foreignProjectModelId,
      view
    })
  ), [foreignProjectModelId, view]);

  return (
    <Modal
      as={Form}
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('Common.labels.related.edit', { name })
          : t('Common.labels.related.add', { name })}
      />
      <Modal.Content>
        <Form.Input
          error={props.isError(foreignKey)}
          label={name}
          required={props.isRequired(foreignKey)}
        >
          <AssociatedDropdown
            collectionName='works'
            header={(
              <RelatedViewMenu
                onChange={(value) => setView(value)}
                value={view}
              />
            )}
            onSearch={onSearch}
            onSelection={props.onAssociationInputChange.bind(this, foreignKey, foreignObjectName)}
            modal={{
              component: WorkModal,
              onSave: (work) => (
                WorksService
                  .save(work)
                  .then(({ data }) => data.work)
              )
            }}
            renderOption={WorkTransform.toDropdown.bind(this)}
            searchQuery={foreignObject?.name}
            value={props.item[foreignKey]}
          />
        </Form.Input>
        { projectModelRelationship && (
          <UserDefinedFieldsForm
            data={props.item.user_defined}
            defineableId={projectModelRelationship.id}
            defineableType='CoreDataConnector::ProjectModelRelationship'
            isError={props.isError}
            onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
            onClearValidationError={props.onClearValidationError}
            tableName='CoreDataConnector::Relationship'
          />
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default RelatedWorkModal;
