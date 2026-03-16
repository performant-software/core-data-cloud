// @flow

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { addInterceptor } from './config/Api';

// Configuration
import './i18n/i18n';

if (!import.meta.env.VITE_AUTH_PROVIDER || import.meta.env.VITE_AUTH_PROVIDER === 'local') {
  addInterceptor()
}

// CSS
import '@performant-software/shared-components/style.css';
import '@performant-software/semantic-components/style.css';
import '@performant-software/geospatial/style.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
