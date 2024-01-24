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

const DplaIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  const getTitle = (item) => {
    if (item?.sourceResource?.title && item?.sourceResource?.title.length > 0) {
      return item?.sourceResource?.title[0];
    }

    return null;
  };

  const getSelectedItem = (data) => {
    if (data?.docs && data.docs.length > 0) {
      return data.docs[0];
    }

    return undefined;
  };

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        onLoad={({ data }) => setSelectedItem(getSelectedItem(data))}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data.docs}
        renderOption={(item) => (
          <Header
            content={getTitle(item)}
            key={item?.id}
            size='small'
            subheader={item?.sourceResource?.description}
          />
        )}
        text={getTitle(selectedItem)}
        value={props.value}
      />
    </Form.Input>
  );
};

export default DplaIdentifierForm;
