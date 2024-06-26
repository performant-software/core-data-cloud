// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import ListViews from '../constants/ListViews';
import OrganizationsService from '../services/Organizations';
import OrganizationTransform from '../transforms/Organization';
import type { Relationship as RelationshipType } from '../types/Relationship';
import RelatedOrganizationModal from './RelatedOrganizationModal';
import RelatedViewMenu from './RelatedViewMenu';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedOrganizationForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    buttons,
    error,
    foreignKey,
    foreignObject,
    foreignObjectName,
    onSave,
    onSelection
  } = useRelationship(props);

  /**
   * Calls the GET API endpoint for organizations.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    OrganizationsService.fetchAll({
      search,
      project_model_id: foreignProjectModelId,
      view
    })
  ), [foreignProjectModelId, view]);

  return (
    <Form>
      <Form.Input
        error={error}
      >
        <AssociatedDropdown
          buttons={buttons}
          collectionName='organizations'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          modal={{
            component: RelatedOrganizationModal,
            props: {
              item: {
                id: props.item.id,
                [foreignKey]: foreignObject?.id,
                [foreignObjectName]: foreignObject
              },
              onInitialize: props.onInitialize,
              required: [foreignKey]
            },
            onSave
          }}
          onSearch={onSearch}
          onSelection={onSelection}
          renderOption={OrganizationTransform.toDropdown.bind(this)}
          searchQuery={foreignObject?.name}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedOrganization = withRelationshipEditForm(RelatedOrganizationForm);
export default RelatedOrganization;
