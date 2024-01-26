// @flow

import React, { useMemo, useState } from 'react';
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

const DplaIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  const selectedItemTitle = useMemo(() => (
    _.first(selectedItem?.sourceResource?.title)
  ), [selectedItem]);

  return (
    <Form.Input
      error={props.error}
      label={t('Common.labels.identifier')}
    >
      <WebIdentifierDropdown
        authorityId={props.authorityId}
        onLoad={({ data }) => setSelectedItem(_.first(data?.docs))}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data.docs}
        renderOption={(item) => (
          <Header
            content={_.first(item?.sourceResource?.title)}
            key={item?.id}
            size='small'
            subheader={item?.sourceResource?.description}
          />
        )}
        text={selectedItemTitle}
        value={props.value}
      />
    </Form.Input>
  );
};

export default DplaIdentifierForm;
