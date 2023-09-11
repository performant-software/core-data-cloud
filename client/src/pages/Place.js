// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import OwnableDropdown from '../components/OwnableDropdown';
import type { Place as PlaceType } from '../types/Place';
import PlaceNameModal from '../components/PlaceNameModal';
import PlacesService from '../services/Places';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

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
          <OwnableDropdown
            item={props.item}
            onSetState={props.onSetState}
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
