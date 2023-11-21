// @flow

import { BooleanIcon, EmbeddedList } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import type { Place as PlaceType } from '../types/Place';
import PlaceNameModal from './PlaceNameModal';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Header
        content={t('PlaceForm.labels.names')}
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
          label: t('PlaceForm.placeNames.columns.name')
        }, {
          name: 'primary',
          label: t('PlaceForm.placeNames.columns.primary'),
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
        defineableId={props.item.project_model_id}
        defineableType='CoreDataConnector::ProjectModel'
        isError={props.isError}
        onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
        onClearValidationError={props.onClearValidationError}
        tableName='CoreDataConnector::Place'
      />
    </>
  );
};

export default PlaceForm;
