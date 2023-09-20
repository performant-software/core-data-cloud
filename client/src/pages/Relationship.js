// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useEffect } from 'react';
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
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelationshipForm = (props: Props) => {
  const { itemId, projectModelRelationshipId } = useParams();

  const {
    projectId,
    primaryClass,
    relatedClass,
    relatedClassView
  } = useProjectModelRelationship();

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
          <AssociatedDropdown
            collectionName='organizations'
            onSearch={(search) => OrganizationsService.fetchAll({ search, project_id: projectId })}
            onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
            renderOption={OrganizationTransform.toDropdown.bind(this)}
            searchQuery={props.item.related_record?.name}
            value={props.item.related_record_id}
          />
        )}
        { relatedClassView === Types.Person && (
          <AssociatedDropdown
            collectionName='people'
            onSearch={(search) => PeopleService.fetchAll({ search, project_id: projectId })}
            onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
            renderOption={PersonTransform.toDropdown.bind(this)}
            searchQuery={PeopleUtils.getNameView(props.item.related_record)}
            value={props.item.related_record_id}
          />
        )}
        { relatedClassView === Types.Place && (
          <AssociatedDropdown
            collectionName='places'
            onSearch={(search) => PlacesService.fetchAll({ search, project_id: projectId })}
            onSelection={props.onAssociationInputChange.bind(this, 'related_record_id', 'related_record')}
            renderOption={PlaceTransform.toDropdown.bind(this)}
            searchQuery={props.item.related_record?.name}
            value={props.item.related_record_id}
          />
        )}
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
  required: ['related_record_id']
});

export default Relationship;
