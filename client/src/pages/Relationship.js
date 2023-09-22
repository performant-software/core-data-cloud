// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useEffect, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import OrganizationsService from '../services/Organizations';
import OrganizationTransform from '../transforms/Organization';
import PeopleUtils from '../utils/People';
import PeopleService from '../services/People';
import PersonTransform from '../transforms/Person';
import PlacesService from '../services/Places';
import PlaceTransform from '../transforms/Place';
import type { Relationship as RelationshipType } from '../types/Relationship';
import RelationshipsService from '../services/Relationships';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelationshipForm = (props: Props) => {
  const { itemId, projectModelRelationshipId } = useParams();

  const {
    projectId,
    projectModelRelationship,
    primaryClass,
    relatedClass,
    relatedClassView
  } = useProjectModelRelationship();

  /**
   * Sets the relationship label as the singular version of the name.
   *
   * @type {string}
   */
  const label = useMemo(() => projectModelRelationship?.related_model?.name_singular, [projectModelRelationship]);

  /**
   * For a new record, set the foreign keys.
   */
  useEffect(() => {
    if (!props.item.id && projectModelRelationshipId && primaryClass && relatedClass) {
      props.onSetState({
        project_model_relationship_id: projectModelRelationshipId,
        primary_record_id: itemId,
        primary_record_type: primaryClass,
        related_record_type: relatedClass
      });
    }
  }, [projectModelRelationshipId, primaryClass, relatedClass, itemId, props.item.id]);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        { relatedClassView === Types.Organization && (
          <Form.Input
            error={props.isError('related_record_id')}
            label={label}
            required={props.isRequired('related_record_id')}
          >
            <AssociatedDropdown
              collectionName='organizations'
              onSearch={(search) => OrganizationsService.fetchAll({ search, project_id: projectId })}
              onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
              renderOption={OrganizationTransform.toDropdown.bind(this)}
              searchQuery={props.item.related_record?.name}
              value={props.item.related_record_id}
            />
          </Form.Input>
        )}
        { relatedClassView === Types.Person && (
          <Form.Input
            error={props.isError('related_record_id')}
            label={label}
            required={props.isRequired('related_record_id')}
          >
            <AssociatedDropdown
              collectionName='people'
              onSearch={(search) => PeopleService.fetchAll({ search, project_id: projectId })}
              onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
              renderOption={PersonTransform.toDropdown.bind(this)}
              searchQuery={PeopleUtils.getNameView(props.item.related_record)}
              value={props.item.related_record_id}
            />
          </Form.Input>
        )}
        { relatedClassView === Types.Place && (
          <Form.Input
            error={props.isError('related_record_id')}
            label={label}
            required={props.isRequired('related_record_id')}
          >
            <AssociatedDropdown
              collectionName='places'
              onSearch={(search) => PlacesService.fetchAll({ search, project_id: projectId })}
              onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
              renderOption={PlaceTransform.toDropdown.bind(this)}
              searchQuery={props.item.related_record?.name}
              value={props.item.related_record_id}
            />
          </Form.Input>
        )}
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

const Relationship = withReactRouterEditPage(RelationshipForm, {
  id: 'relationshipId',
  onInitialize: (id) => (
    RelationshipsService
      .fetchOne(id)
      .then(({ data }) => data.relationship)
  ),
  onSave: (relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
  ),
  required: ['related_record_id'],
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Relationship;
