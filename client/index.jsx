import React from 'react';
import promiseFinally from 'promise.prototype.finally';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import App from './components/App';

import commonStore from './stores/commonStore';
import transactionStore from './stores/transactionStore';
import authStore from './stores/authStore';
import currencyStore from './stores/currencyStore';
import portfolioChartStore from './stores/portfolioChartStore';
import coinStore from './stores/coinStore';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import 'react-day-picker/lib/style.css';
import './css/bootstrap-theme.css';
import './css/app.css';
import './css/loader.css';

const stores = {
  commonStore,
  transactionStore,
  authStore,
  currencyStore,
  coinStore,
  portfolioChartStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
