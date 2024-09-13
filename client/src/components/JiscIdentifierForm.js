// @flow

import React, { useCallback, useState } from 'react';
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

const BASE_URL = 'https://discover.libraryhub.jisc.ac.uk/search?id=';

const JiscIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  // For some reason, Jisc's payloads include a URI that
  // contains the unique ID but not the ID itself.
  const resolveId = useCallback((item) => (
    item?.uri
      ? item.uri.replace(BASE_URL, '').replace('&rn=1', '')
      : null
  ), []);

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        onLoad={({ data }) => setSelectedItem(_.first(data?.records))}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data?.records}
        renderOption={(item) => (
          <Header
            content={item?.bibliographic_data?.title}
            key={item?.uri}
            size='small'
            subheader={item?.bibliographic_data?.physical_description}
          />
        )}
        resolveId={resolveId}
        text={selectedItem?.bibliographic_data?.title}
        value={props.value}
      />
    </Form.Input>
  );
};

export default JiscIdentifierForm;
