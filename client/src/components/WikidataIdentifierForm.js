// @flow

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header } from 'semantic-ui-react';
import WebIdentifierDropdown from './WebIdentifierDropdown';

type Props = {
  authorityId: number,
  error?: boolean,
  onSelection: (identifier: ?string | ?number) => void,
  value: string | number
};

const WikidataIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        onLoad={({ data }) => setSelectedItem(data?.entities[props.value])}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data.search}
        renderOption={(item) => (
          <Header
            content={item.label}
            size='small'
            subheader={item.description}
          />
        )}
        text={selectedItem?.labels?.en?.value}
        value={props.value}
      />
    </Form.Input>
  );
};

export default WikidataIdentifierForm;
