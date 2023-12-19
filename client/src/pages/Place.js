// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import SaveButton from '../components/SaveButton';
import initialize from '../hooks/Item';
import type { Place as PlaceType } from '../types/Place';
import PlaceForm from '../components/PlaceForm';
import PlacesService from '../services/Places';
import Relationships from '../components/Relationships';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlacePage = (props: Props) => {
  /**
   * Set the required foreign keys on the state.
   */
  initialize(props);

  return (
    <>
      <PlaceForm
        {...props}
      />
      <SaveButton
        onClick={props.onSave}
      />
      <Relationships />
    </>
  );
};

const Place: AbstractComponent<any> = withReactRouterEditPage(PlacePage, {
  id: 'itemId',
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
