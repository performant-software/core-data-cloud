// @flow

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Form, Header } from 'semantic-ui-react';
import _ from 'underscore';
import WebIdentifierDropdown from './WebIdentifierDropdown';

type Props = {
  authorityId: number,
  error?: boolean,
  extra: {
    languages_of_material?: Array<string>,
    place_access_points?: Array<string>,
    subject_access_points?: Array<string>
  },
  onExtraSelection: (key: string, value: string) => void,
  onSelection: (identifier: ?string | ?number) => void,
  value: string
};

type ExtraProps = {
  label: string,
  multiple?: boolean,
  options: Array<string>,
  onChange: (string) => void,
  value: string
};

const AtomExtraDropdown = (props: ExtraProps) => {
  /**
   * Sets the list of available options.
   */
  const options = useMemo(() => _.map(props.options, (value) => ({ key: value, value, text: value })), [props.options]);

  return (
    <Form.Input
      label={props.label}
    >
      <Dropdown
        clearable
        fluid
        multiple={props.multiple}
        options={options}
        onChange={props.onChange}
        selection
        selectOnBlur={false}
        value={props.value}
      />
    </Form.Input>
  );
};

const AtomIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  return (
    <>
      <Form.Input
        error={props.error}
        label={t('Common.labels.identifier')}
      >
        <WebIdentifierDropdown
          authorityId={props.authorityId}
          id='slug'
          onLoad={({ data }) => setSelectedItem(data)}
          onSelection={(identifier) => props.onSelection(identifier)}
          onSearch={(data) => data.results}
          renderOption={(item) => (
            <Header
              content={item.title}
              size='small'
              subheader={item.reference_code}
            />
          )}
          text={selectedItem?.title}
          value={props.value}
        />
      </Form.Input>
      { selectedItem && selectedItem.place_access_points && (
        <AtomExtraDropdown
          label={t('AtomIdentifierForm.labels.geographic')}
          onChange={props.onExtraSelection.bind(this, 'place_access_points')}
          options={selectedItem.place_access_points}
          value={props.extra?.place_access_points}
        />
      )}
      { selectedItem && selectedItem.languages_of_material && (
        <AtomExtraDropdown
          label={t('AtomIdentifierForm.labels.language')}
          multiple
          onChange={props.onExtraSelection.bind(this, 'languages_of_material')}
          options={selectedItem.languages_of_material}
          value={props.extra?.languages_of_material}
        />
      )}
      { selectedItem && selectedItem.subject_access_points && (
        <AtomExtraDropdown
          label={t('AtomIdentifierForm.labels.subject')}
          multiple
          onChange={props.onExtraSelection.bind(this, 'subject_access_points')}
          options={selectedItem.subject_access_points}
          value={props.extra?.subject_access_points}
        />
      )}
    </>
  );
};

export default AtomIdentifierForm;
