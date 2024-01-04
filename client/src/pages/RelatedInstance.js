// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { initialize, useRelationship, withRelationshipEditPage } from '../hooks/Relationship';
import ListViews from '../constants/ListViews';
import InstanceModal from '../components/InstanceModal';
import InstanceTransform from '../transforms/Instance';
import InstancesService from '../services/Instances';
import RelatedViewMenu from '../components/RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

type Props = EditContainerProps & {
  instance: RelationshipType
};

const RelatedInstanceForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);

  const { projectModelRelationshipId } = useParams();
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    foreignKey,
    foreignObject,
    foreignObjectName,
    label
  } = useRelationship(props);

  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  /**
   * Calls the GET API endpoint for instances.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    InstancesService.fetchAll({
      search,
      project_model_id: foreignProjectModelId,
      view
    })
  ), [foreignProjectModelId, view]);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Form.Input
          error={props.isError(foreignKey)}
          label={label}
          required={props.isRequired(foreignKey)}
        >
          <AssociatedDropdown
            collectionName='instances'
            header={(
              <RelatedViewMenu
                onChange={(value) => setView(value)}
                value={view}
              />
            )}
            onSearch={onSearch}
            onSelection={props.onAssociationInputChange.bind(this, foreignKey, foreignObjectName)}
            modal={{
              component: InstanceModal,
              onSave: (instance) => (
                InstancesService
                  .save(instance)
                  .then(({ data }) => data.instance)
              )
            }}
            renderOption={InstanceTransform.toDropdown.bind(this)}
            searchQuery={foreignObject?.primary_name?.name.name}
            value={props.item[foreignKey]}
          />
        </Form.Input>
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelRelationshipId}
          defineableType='CoreDataConnector::ProjectModelRelationship'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Relationship'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const RelatedInstance = withRelationshipEditPage(RelatedInstanceForm);
export default RelatedInstance;
