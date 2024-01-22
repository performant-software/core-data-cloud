// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';

type Props = {
  isError: (key: string) => boolean,
  onChange: (key: string, value: string) => void,
  value: { [key: string]: string }
};

const AtomForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Input
        error={props.isError('access.url')}
        label={t('AtomForm.labels.url')}
        required
        onChange={(e, { value }) => props.onChange('url', value)}
        value={props.value?.url}
      />
      <Form.Input
        error={props.isError('access.api_key')}
        label={t('AtomForm.labels.apiKey')}
        required
        onChange={(e, { value }) => props.onChange('api_key', value)}
        value={props.value?.api_key}
      />
    </>
  );
};

export default AtomForm;
