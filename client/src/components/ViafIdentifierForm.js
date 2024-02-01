// @flow

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import WebIdentifierDropdown from './WebIdentifierDropdown';
import _ from 'underscore';

type Props = {
  authorityId: number,
  error?: boolean,
  onSelection: (identifier: ?string | ?number) => void,
  value: string | number
};

const ViafIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        id='viafid'
        onLoad={({ data }) => setSelectedItem(data)}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data.result}
        renderOption={(item) => (
          <Header
            content={item?.term}
            key={item?.viafid}
            size='small'
          />
        )}
        text={_.first(selectedItem?.mainHeadings?.data)?.text}
        value={props.value}
      />
    </Form.Input>
  );
};

export default ViafIdentifierForm;
