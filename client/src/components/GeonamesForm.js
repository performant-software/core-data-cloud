// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';

type Props = {
  isError: (key: string) => boolean,
  onChange: (key: string, value: string) => void,
  value: { [key: string]: string }
};

const GeonamesForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Form.Input
      error={props.isError('access.username')}
      label={t('GeoNamesForm.labels.username')}
      required
      onChange={(e, { value }) => props.onChange('username', value)}
      value={props.value?.username || ''}
    />
  );
};

export default GeonamesForm;
