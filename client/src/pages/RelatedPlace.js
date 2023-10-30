// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import PlacesService from '../services/Places';
import PlaceTransform from '../transforms/Place';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship, withRelationshipEditPage } from '../hooks/Relationship';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedPlaceForm = (props: Props) => {
  const { projectModelRelationshipId } = useParams();
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    foreignKey,
    foreignObject,
    foreignObjectName,
    label,
    onNewRecord
  } = useRelationship(props);

  /**
   * For a new record, set the foreign keys.
   */
  useEffect(() => onNewRecord(), []);

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
            collectionName='places'
            onSearch={(search) => PlacesService.fetchAll({ search, project_model_id: foreignProjectModelId })}
            onSelection={props.onAssociationInputChange.bind(this, foreignKey, foreignObjectName)}
            renderOption={PlaceTransform.toDropdown.bind(this)}
            searchQuery={foreignObject?.name}
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

const RelatedPlace = withRelationshipEditPage(RelatedPlaceForm);
export default RelatedPlace;
