// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RelationshipsService from '../services/Relationships';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const Relationships = () => {
  const navigate = useNavigate();
  const { itemId, projectModelRelationshipId } = useParams();
  const { primaryClass, relatedClassView } = useProjectModelRelationship();

  /**
   * Build the list of columns based on the related class.
   *
   * @type {[]}
   */
  const columns = useMemo(() => {
    const value = [];

    if (relatedClassView === Types.Organization) {
      value.push({
        name: 'name',
        label: 'Name',
        resolve: (relationship) => relationship.related_record?.name
      });
    } else if (relatedClassView === Types.Person) {
      value.push({
        name: 'last_name',
        label: 'Last name',
        resolve: (relationship) => relationship.related_record?.last_name
      });
      value.push({
        name: 'first_name',
        label: 'First name',
        resolve: (relationship) => relationship.related_record?.first_name
      });
    } else if (relatedClassView === Types.Place) {
      value.push({
        name: 'name',
        label: 'Name',
        resolve: (relationship) => relationship.related_record?.name
      });
    }

    return value;
  }, [relatedClassView]);

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (relationship) => navigate(`${relationship.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='relationships'
      columns={columns}
      onDelete={(relationship) => RelationshipsService.delete(relationship)}
      onLoad={(params) => RelationshipsService.fetchAll({
        ...params,
        project_model_relationship_id: projectModelRelationshipId,
        primary_record_id: itemId,
        primary_record_type: primaryClass,
        defineable_id: projectModelRelationshipId,
        defineable_type: 'CoreDataConnector::ProjectModelRelationship'
      })}
      searchable
    />
  );
};

export default Relationships;
