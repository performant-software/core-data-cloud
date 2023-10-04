// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { type AbstractComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import type { Place as PlaceType } from '../types/Place';
import PlaceNameModal from '../components/PlaceNameModal';
import PlacesService from '../services/Places';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceForm = (props: Props) => {
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (!props.item.id) {
      props.onSetState({ project_model_id: projectModelId });
    }
  }, [projectModelId, props.item.id]);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Header
          content={t('Place.labels.names')}
        />
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
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
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelId}
          defineableType='CoreDataConnector::ProjectModel'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Place'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Place: AbstractComponent<any> = withReactRouterEditPage(PlaceForm, {
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
