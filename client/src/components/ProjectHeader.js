// @flow

import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import type { Project as ProjectType } from '../types/Project';

type Props = {
  project: ProjectType
};

const ProjectHeader = (props: Props) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    { props.project.name }
    <Dropdown
      direction='left'
      icon={(
        <Icon
          color='grey'
          name='ellipsis vertical'
          style={{
            opacity: '0.5'
          }}
        />
      )}
    >
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          content={'Edit'}
          icon='edit'
          to={`${props.project.id}/edit`}
        />
        <Dropdown.Item
          as={Link}
          content={'Settings'}
          icon='cog'
          to={`${props.project.id}`}
        />
      </Dropdown.Menu>
    </Dropdown>
  </div>
);

export default ProjectHeader;