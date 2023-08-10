// @flow

import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDragDrop } from '@performant-software/shared-components';
import Admin from './pages/Admin';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Home from './pages/Home';

const App: ComponentType<any> = useDragDrop(() => (
  <Router>
    <Routes>
      <Route
        path='/'
        element={<Home />}
        index
      />
      <Route
        path='/admin'
        element={(
          <AuthenticatedRoute>
            <Admin />
          </AuthenticatedRoute>
        )}
      />
    </Routes>
  </Router>
));

export default App;
