// @flow

import { useDragDrop } from '@performant-software/shared-components';
import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import CurrentRecordContextProvider from './components/CurrentRecordContextProvider';
import Layout from './components/Layout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Project from './pages/Project';
import ProjectContextProvider from './components/ProjectContextProvider';
import ProjectEdit from './pages/ProjectEdit';
import ProjectImport from './pages/ProjectImport';
import ProjectModel from './pages/ProjectModel';
import ProjectModelFactory from './components/ProjectModelFactory';
import ProjectModelRelationshipFactory from './components/ProjectModelRelationshipFactory';
import ProjectModelRelationshipsFactory from './components/ProjectModelRelationshipsFactory';
import ProjectModels from './pages/ProjectModels';
import ProjectModelsFactory from './components/ProjectModelsFactory';
import ProjectSettingsContextProvider from './components/ProjectSettingsContextProvider';
import Projects from './pages/Projects';
import User from './pages/User';
import UserProject from './pages/UserProject';
import UserProjects from './pages/UserProjects';
import Users from './pages/Users';

const App: ComponentType<any> = useDragDrop(() => (
  <Router>
    <Routes>
      <Route
        path='/'
        element={<Login />}
        exact
        index
      />
      <Route
        path='/'
        element={(
          <AuthenticatedRoute>
            <ProjectContextProvider>
              <ProjectSettingsContextProvider>
                <CurrentRecordContextProvider>
                  <Layout />
                </CurrentRecordContextProvider>
              </ProjectSettingsContextProvider>
            </ProjectContextProvider>
          </AuthenticatedRoute>
        )}
      >
        <Route
          path='/logout'
          element={<Logout />}
        />
        <Route
          path='/projects'
        >
          <Route
            index
            element={<Projects />}
          />
          <Route
            path='new'
            element={<Project />}
          />
          <Route
            path=':projectId'
          >
            <Route
              index
              element={<Project />}
            />
            <Route
              path='edit'
              element={<ProjectEdit />}
              exact
            />
            <Route
              path='user_projects'
            >
              <Route
                index
                element={<UserProjects />}
              />
              <Route
                path='new'
                element={<UserProject />}
              />
              <Route
                path=':userProjectId'
                element={<UserProject />}
              />
            </Route>
            <Route
              path='project_models'
            >
              <Route
                index
                element={<ProjectModels />}
              />
              <Route
                path='new'
                element={<ProjectModel />}
              />
              <Route
                path=':projectModelId'
                element={<ProjectModel />}
              />
            </Route>
            <Route
              path='import'
              element={<ProjectImport />}
            />
            <Route
              path=':projectModelId'
            >
              <Route
                index
                element={<ProjectModelsFactory />}
              />
              <Route
                path='new'
                element={<ProjectModelFactory />}
              />
              <Route
                path=':itemId'
              >
                <Route
                  index
                  element={<ProjectModelFactory />}
                />
                <Route
                  path=':projectModelRelationshipId'
                >
                  <Route
                    index
                    element={<ProjectModelRelationshipsFactory />}
                  />
                  <Route
                    path='new'
                    element={<ProjectModelRelationshipFactory />}
                  />
                  <Route
                    path=':relationshipId'
                    element={<ProjectModelRelationshipFactory />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path='/users'
        >
          <Route
            index
            element={<Users />}
          />
          <Route
            path='new'
            element={<User />}
          />
          <Route
            path=':userId'
          >
            <Route
              index
              element={<User />}
            />
            <Route
              path='user_projects'
            >
              <Route
                index
                element={<UserProjects />}
              />
              <Route
                path='new'
                element={<UserProject />}
              />
              <Route
                path=':userProjectId'
                element={<UserProject />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  </Router>
));

export default App;
