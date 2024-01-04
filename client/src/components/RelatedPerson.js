// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import ListViews from '../constants/ListViews';
import PeopleService from '../services/People';
import PeopleUtils from '../utils/People';
import PersonTransform from '../transforms/Person';
import RelatedPersonModal from './RelatedPersonModal';
import RelatedViewMenu from './RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedPersonForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    error,
    foreignKey,
    foreignObject,
    onSave,
    onSelection
  } = useRelationship(props);

  /**
   * Calls the GET API endpoint for people.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    PeopleService.fetchAll({
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
          buttons={[{
            accept: () => !!props.item[foreignKey],
            content: null,
            icon: 'pencil',
            name: 'edit'
          }, {
            accept: () => !props.item[foreignKey],
            content: null,
            icon: 'pencil',
            name: 'add'
          }, {
            content: null,
            name: 'clear'
          }]}
          collectionName='people'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          modal={{
            component: RelatedPersonModal,
            props: {
              item: {
                id: props.item.id
              },
              onInitialize: props.onInitialize,
              required: [foreignKey]
            },
            onSave
          }}
          onSearch={onSearch}
          onSelection={onSelection}
          renderOption={PersonTransform.toDropdown.bind(this)}
          searchQuery={PeopleUtils.getNameView(foreignObject)}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedPerson = withRelationshipEditForm(RelatedPersonForm);
export default RelatedPerson;
