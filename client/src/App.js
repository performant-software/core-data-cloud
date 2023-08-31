// @flow

import { useDragDrop } from '@performant-software/shared-components';
import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Place from './pages/Place';
import Places from './pages/Places';
import Project from './pages/Project';
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
            <Layout />
          </AuthenticatedRoute>
        )}
      >
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
              path='places'
            >
              <Route
                index
                element={<Places />}
              />
              <Route
                path='new'
                element={<Place />}
              />
              <Route
                path=':placeId'
                element={<Place />}
              />
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
        <Route
          path='places'
        >
          <Route
            index
            element={<Places />}
          />
          <Route
            path='new'
            element={<Place />}
          />
          <Route
            path=':placeId'
            element={<Place />}
          />
        </Route>
      </Route>
    </Routes>
  </Router>
));

export default App;
