// @flow

import React from 'react';
import { Header } from 'semantic-ui-react';
import WebIdentifierDropdown from './WebIdentifierDropdown';

type Props = {
  authorityId: number,
  onChange: (id: string) => void,
  value: string
};

const AtomDropdown = (props: Props) => (
  <WebIdentifierDropdown
    authorityId={props.authorityId}
    id='slug'
    onChange={props.onChange}
    onSearch={(data) => data.results}
    renderOption={(item) => (
      <Header
        content={item.title}
        size='small'
        subheader={item.reference_code}
      />
    )}
    resolveLabel={(data) => data.title}
    value={props.value}
  />
);

export default AtomDropdown;
