// @flow

import { useDragDrop } from '@performant-software/shared-components';
import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import CurrentRecordContextProvider from './components/CurrentRecordContextProvider';
import EditPageFactory from './components/EditPageFactory';
import Layout from './components/Layout';
import ListPageFactory from './components/ListPageFactory';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Project from './pages/Project';
import ProjectContextProvider from './components/ProjectContextProvider';
import ProjectEdit from './pages/ProjectEdit';
import ProjectModel from './pages/ProjectModel';
import ProjectModels from './pages/ProjectModels';
import Projects from './pages/Projects';
import Relationship from './pages/Relationship';
import RelationshipFactory from './components/RelationshipFactory';
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
              <CurrentRecordContextProvider>
                <Layout />
              </CurrentRecordContextProvider>
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
              path=':projectModelId'
            >
              <Route
                index
                element={<ListPageFactory />}
              />
              <Route
                path='new'
                element={<EditPageFactory />}
              />
              <Route
                path=':itemId'
              >
                <Route
                  index
                  element={<EditPageFactory />}
                />
                <Route
                  path=':projectModelRelationshipId'
                >
                  <Route
                    index
                    element={<RelationshipFactory />}
                  />
                  <Route
                    path='new'
                    element={<Relationship />}
                  />
                  <Route
                    path=':relationshipId'
                    element={<Relationship />}
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
