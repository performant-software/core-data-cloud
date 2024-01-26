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

const BnfIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        id='recordIdentifier'
        onLoad={({ data }) => setSelectedItem(data?.searchRetrieveResponse?.records?.record)}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data?.searchRetrieveResponse?.records?.record}
        renderOption={(item) => (
          <Header
            content={item?.recordData?.dc?.title}
            key={item.id}
            size='small'
            subheader={item?.recordData?.dc?.contributor}
          />
        )}
        text={selectedItem?.recordData?.dc?.title}
        value={props.value}
      />
    </Form.Input>
  );
};

export default BnfIdentifierForm;
