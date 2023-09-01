// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import React, {
  useCallback,
  useEffect,
  useState,
  type AbstractComponent
} from 'react';
import { useParams } from 'react-router-dom';
import type { Project as ProjectType } from '../types/Project';
import type { Projectable as ProjectableType } from '../types/Projectable';
import ProjectsService from '../services/Projects';
import ProjectTransform from '../transforms/Project';

type Props = {
  item: ProjectableType,
  onSetState: (item: any) => void
};

const OwnableDropdown: AbstractComponent<any> = (props: Props) => {
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState();

  /**
   * If we're in the context of a single project, only return the current project.
   * Otherwise call the `/api/projects` endpoint.
   *
   * @type {function(string): *}
   */
  const onSearch = useCallback((search: string) => {
    let promise;

    if (currentProject) {
      promise = Promise.resolve({ data: { projects: [currentProject] } });
    } else {
      promise = ProjectsService.fetchAll({ search });
    }

    return promise;
  }, [currentProject]);

  /**
   * Sets the project on the state's `project_item`.
   *
   * @type {function(Project): *}
   */
  const onSelection = useCallback((project: ProjectType) => props.onSetState({
    project_item: {
      project_id: project.id,
      project
    }
  }), []);

  /**
   * If we're in the context of a single project, load the project and set it on the state.
   */
  useEffect(() => {
    if (projectId) {
      ProjectsService
        .fetchOne(projectId)
        .then(({ data }) => setCurrentProject(data.project));
    }
  }, []);

  /**
   * If we're adding a new record, select the current project by default.
   */
  useEffect(() => {
    if (currentProject && !props.item.id) {
      onSelection(currentProject);
    }
  }, [currentProject]);

  return (
    <AssociatedDropdown
      collectionName='projects'
      onSearch={onSearch}
      onSelection={onSelection}
      renderOption={(project) => ProjectTransform.toDropdown(project)}
      searchQuery={props.item.project_item?.project?.name}
      value={props.item.project_item?.project_id}
    />
  );
};

export default OwnableDropdown;
