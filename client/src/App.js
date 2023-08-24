// @flow

import { useDragDrop } from '@performant-software/shared-components';
import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Project from './pages/Project';
import Projects from './pages/Projects';
import User from './pages/User';
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
            element={<Project />}
          />
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
            element={<User />}
          />
        </Route>
      </Route>
    </Routes>
  </Router>
));

export default App;
