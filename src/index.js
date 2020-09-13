import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import config from './aws-exports';
import './index.scss';
import { ThemeProvider } from './Theme';
import { ToasterProvider } from './Toaster';

Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToasterProvider>
        <App />
      </ToasterProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
