// @flow

import type { EditContainerProps } from '@performant-software/shared-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { Taxonomy as TaxonomyType } from '../types/Taxonomy';

type Props = EditContainerProps & {
  item: TaxonomyType
};

const TaxonomyItemForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Form.Input
        autoFocus
        error={props.isError('name')}
        label={t('TaxonomyItems.labels.name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        required={props.isRequired('name')}
        value={props.item.name}
      />
    </Form>
  );
};

export default TaxonomyItemForm;
