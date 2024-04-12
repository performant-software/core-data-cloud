// @flow

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Configuration
import './config/Api';
import './i18n/i18n';

// CSS
import '@performant-software/shared-components/style.css';
import '@performant-software/semantic-components/style.css';
import '@performant-software/semantic-components/style.css';
import '@performant-software/geospatial/style.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />
);
