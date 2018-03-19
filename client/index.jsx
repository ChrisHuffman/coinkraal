import React from 'react';
import promiseFinally from 'promise.prototype.finally';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { defaults } from 'react-chartjs-2';

import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import 'react-day-picker/lib/style.css';
import './css/bootstrap-theme.css';
import './css/app.css';
import './css/loader.css';

//Stores
import authStore from './stores/authStore';
import TransactionStore from './stores/transactionStore';
import CommonStore from './stores/commonStore';
import CurrencyStore from './stores/currencyStore';
import CoinStore from './stores/coinStore';
import SocialStore from './stores/socialStore';
import ExchangeStore from './stores/exchangeStore';
var transactionStore = new TransactionStore();
var commonStore = new CommonStore();
var currencyStore = new CurrencyStore();
var coinStore = new CoinStore();
var socialStore = new SocialStore();
var exchangeStore = new ExchangeStore();


//Global
import Global from './global';
var global = new Global(authStore, currencyStore, transactionStore, exchangeStore);


//Services
import PortfolioChartService from './services/PortfolioChartService';
import CoinChartService from './services/CoinChartService';
var portfolioChartService = new PortfolioChartService();
var coinChartService = new CoinChartService();


//PageState
import PortfolioPageState from './components/portfolio/PortfolioPageState';
import TransactionsPageState from './components/transactions/TransactionsPageState'
import CoinsPageState from './components/coins/CoinsPageState'
var portfolioPageState = new PortfolioPageState(global, transactionStore, portfolioChartService);
var transactionsPageState = new TransactionsPageState();
var coinsPageState = new CoinsPageState(global, coinStore, coinChartService);


//Start Load of App Data
global.loadApplicationData();

const stores = {
  authStore,

  commonStore,
  transactionStore,
  currencyStore,
  coinStore,
  socialStore,
  exchangeStore,

  portfolioPageState,
  transactionsPageState,
  coinsPageState,

  global
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
