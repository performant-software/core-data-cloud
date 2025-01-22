// @flow

import { useDragDrop } from '@performant-software/shared-components';
import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Project from './pages/Project';
import ProjectContextProvider from './components/ProjectContextProvider';
import ProjectEdit from './pages/ProjectEdit';
import ProjectImportExport from './pages/ProjectImportExport';
import ProjectModel from './pages/ProjectModel';
import ProjectModelFactory from './components/ProjectModelFactory';
import ProjectModels from './pages/ProjectModels';
import ProjectModelsFactory from './components/ProjectModelsFactory';
import Projects from './pages/Projects';
import User from './pages/User';
import UserProject from './pages/UserProject';
import UserProjects from './pages/UserProjects';
import Users from './pages/Users';
import WebAuthorities from './pages/WebAuthorities';
import WebAuthority from './pages/WebAuthority';
import SsoLogin from './pages/SsoLogin';

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
        element={<SsoLogin />}
        path='sso-login'
      />
      <Route
        path='/'
        element={(
          <AuthenticatedRoute>
            <ProjectContextProvider>
              <Layout />
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
              element={<ProjectImportExport />}
            />
            <Route
              path='web_authorities'
            >
              <Route
                index
                element={<WebAuthorities />}
              />
              <Route
                path='new'
                element={<WebAuthority />}
              />
              <Route
                path=':webAuthorityId'
                element={<WebAuthority />}
              />
            </Route>
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
