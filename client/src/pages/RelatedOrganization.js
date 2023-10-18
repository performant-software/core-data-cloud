// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import OrganizationsService from '../services/Organizations';
import OrganizationTransform from '../transforms/Organization';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useParams from '../hooks/ParsedParams';
import { useRelationship, withRelationshipEditPage } from '../hooks/Relationship';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedOrganizationForm = (props: Props) => {
  const { projectId, projectModelRelationshipId } = useParams();
  const { label, onNewRecord } = useRelationship(props);

  /**
   * For a new record, set the foreign keys.
   */
  useEffect(() => onNewRecord(), [onNewRecord]);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
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

const RelatedOrganization = withRelationshipEditPage(RelatedOrganizationForm);
export default RelatedOrganization;
