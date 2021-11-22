import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactTooltip from 'react-tooltip';
import 'moment/locale/id';
import './index.css';
import { SWRConfig } from 'swr';

moment.locale(window.navigator.userLanguage || window.navigator.language || 'id');

/**
 * @type {import('swr').SWRConfiguration}
 */
const swrConfig = {
  fetcher: (...args) => fetch(...args).then(res => res.json()),
}

ReactDOM.render(
  <SWRConfig value={swrConfig}>
    <App />
    <ReactTooltip/>
  </SWRConfig>,
  document.getElementById('root')
);
