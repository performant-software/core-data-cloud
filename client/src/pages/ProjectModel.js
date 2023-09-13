// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import ModelClassDropdown from '../components/ModelClassDropdown';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelsUtils from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: ProjectModelType
};

const ProjectModelForm = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();

  /*
   * For a new record, set the foreign key ID based on the route parameters.
   */
  useEffect(() => {
    if (!props.item.id && params.projectId) {
      props.onSetState({ project_id: params.projectId });
    }
  }, []);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Form.Input
          error={props.isError('model_class')}
          label={t('ProjectModel.labels.type')}
          required={props.isRequired('model_class')}
        >
          <ModelClassDropdown
            fluid
            onChange={props.onTextInputChange.bind(this, 'model_class')}
            value={props.item.model_class}
          />
        </Form.Input>
        <Form.Input
          error={props.isError('name')}
          label={t('ProjectModel.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const ProjectModel = withReactRouterEditPage(ProjectModelForm, {
  id: 'projectModelId',
  onInitialize: (id) => (
    ProjectModelsService
      .fetchOne(id)
      .then(({ data }) => data.project_model)
  ),
  onSave: (projectModel) => (
    ProjectModelsService
      .save(projectModel)
      .then(({ data }) => data.project_model)
  ),
  required: ['model_class', 'name'],
  resolveValidationError: ProjectModelsUtils.resolveValidationError.bind(this)
});

export default ProjectModel;
