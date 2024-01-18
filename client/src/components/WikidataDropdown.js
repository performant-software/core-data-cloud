// @flow

import React from 'react';
import { Header } from 'semantic-ui-react';
import WebIdentifierDropdown from './WebIdentifierDropdown';

type Props = {
  authorityId: number,
  onChange: () => void,
  value: string | number
};

const WikidataDropdown = (props: Props) => (
  <WebIdentifierDropdown
    authorityId={props.authorityId}
    onChange={props.onChange}
    onSearch={(data) => data.search}
    renderOption={(item) => (
      <Header
        content={item.label}
        size='small'
        subheader={item.description}
      />
    )}
    resolveLabel={(data) => data.entities[props.value]?.labels?.en?.value}
    value={props.value}
  />
);

export default WikidataDropdown;
