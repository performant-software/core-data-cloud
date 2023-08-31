// @flow

import {
  AssociatedDropdown,
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import PlaceNameModal from '../components/PlaceNameModal';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import PlacesService from '../services/Places';
import ProjectsService from '../services/Projects';
import ProjectTransform from '../transforms/Project';
import type { Place as PlaceType } from '../types/Place';
import Validation from '../utils/Validation';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Form.Input
          label={t('Place.labels.project')}
          required
        >
          <AssociatedDropdown
            collectionName='projects'
            onSearch={(search) => ProjectsService.fetchAll({ search })}
            onSelection={(project) => props.onSetState({ project_item: { project_id: project.id, project } })}
            renderOption={(project) => ProjectTransform.toDropdown(project)}
            searchQuery={props.item.project_item?.project?.name}
            value={props.item.project_item?.project_id}
          />
        </Form.Input>
        <Header
          content={t('Place.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          columns={[{
            name: 'name',
            label: t('Place.placeNames.columns.name')
          }, {
            name: 'primary',
            label: t('Place.placeNames.columns.primary'),
            render: (placeName) => <BooleanIcon value={placeName.primary} />
          }]}
          items={props.item.place_names}
          modal={{
            component: PlaceNameModal
          }}
          onSave={props.onSaveChildAssociation.bind(this, 'place_names')}
          onDelete={props.onDeleteChildAssociation.bind(this, 'place_names')}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Place: AbstractComponent<any> = withReactRouterEditPage(PlaceForm, {
  id: 'placeId',
  onInitialize: (id) => (
    PlacesService
      .fetchOne(id)
      .then(({ data }) => data.place)
  ),
  onSave: (place) => (
    PlacesService
      .save(place)
      .then(({ data }) => data.place)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Place;
