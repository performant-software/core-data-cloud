// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Header } from "semantic-ui-react";
import WebIdentifierDropdown from "./WebIdentifierDropdown";

type Props = {
  authorityId: number,
  error?: boolean,
  onSelection: (identifier: ?string | ?number) => void,
  value: string | number,
};

const GeonamesIdentifierForm = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();

  return (
    <Form.Input error={props.error} label={t("Common.labels.identifier")}>
      <WebIdentifierDropdown
        id="geonameId"
        authorityId={props.authorityId}
        onLoad={({ data }) => setSelectedItem(data)}
        onSelection={(identifier) => props.onSelection(identifier)}
        onSearch={(data) => data.geonames}
        renderOption={(item) => (
          <Header
            content={item.name}
            size="small"
            subheader={`${item.fcodeName}: ${item.adminName1}, ${item.countryCode}`}
          />
        )}
        text={selectedItem?.name}
        value={props.value}
      />
    </Form.Input>
  );
};

export default GeonamesIdentifierForm;
