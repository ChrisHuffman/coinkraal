import React from 'react';
import promiseFinally from 'promise.prototype.finally';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { defaults } from 'react-chartjs-2';

import App from './components/App';

import commonStore from './stores/commonStore';
import transactionStore from './stores/transactionStore';
import authStore from './stores/authStore';
import currencyStore from './stores/currencyStore';
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
  coinStore
};

promiseFinally.shim();
useStrict(true);

//Chartjs Defaults
defaults.global.defaultFontFamily = 'Roboto Mono';
defaults.global.defaultFontColor = '#e9ecef';

defaults.global.tooltips.cornerRadius = 2;
defaults.global.tooltips.backgroundColor = 'rgba(233, 236, 239, 1)';
defaults.global.tooltips.titleFontColor = 'rgba(32, 32, 32, 1)';
defaults.global.tooltips.bodyFontColor = 'rgba(32, 32, 32, 1)';
defaults.global.tooltips.borderColor = 'rgba(0,0,0,1)';
defaults.global.tooltips.borderWidth = 1;
defaults.global.tooltips.xPadding = 10;
defaults.global.tooltips.yPadding = 10;

defaults.scale.gridLines.display = false;



ReactDOM.render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
