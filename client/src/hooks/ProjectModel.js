// @flow

import { useEffect, useState } from 'react';
import useParams from './ParsedParams';
import ProjectModelsService from '../services/ProjectModels';

const Types = {
  Organization: 'Organization',
  Person: 'Person',
  Place: 'Place'
};

const useProjectModel = () => {
  const [projectModel, setProjectModel] = useState();
  const { projectModelId } = useParams();

  useEffect(() => {
    ProjectModelsService
      .fetchOne(projectModelId)
      .then(({ data }) => setProjectModel(data.project_model));
  }, [projectModelId]);

  return {
    projectModel,
    className: projectModel?.model_class_view
  };
};

export default useProjectModel;

export {
  Types
};
