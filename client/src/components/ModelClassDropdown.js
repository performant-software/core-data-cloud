// @flow

import React, { useEffect, useState } from 'react';
import ProjectModelsService from '../services/ProjectModels';
import { Dropdown } from 'semantic-ui-react';
import _ from 'underscore';

type Props = {
  onChange: (e: Event, data: any) => void,
  value: ?string
};

const ModelClassDropdown = ({ onChange, value, ...props }: Props) => {
  const [modelClasses, setModelClasses] = useState([]);

  useEffect(() => {
    ProjectModelsService
      .fetchModelClasses()
      .then(({ data }) => setModelClasses(data.model_classes));
  }, []);

  return (
    <Dropdown
      {...props}
      options={_.map(modelClasses, (modelClass) => ({
        key: modelClass.value,
        value: modelClass.value,
        text: modelClass.label
      }))}
      onChange={onChange}
      search
      selection
      value={value}
    />
  );
};

export default ModelClassDropdown;
