import React from 'react';
import promiseFinally from 'promise.prototype.finally';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { defaults } from 'react-chartjs-2';
import Agent from 'coinkraal-agent';
import serviceFactory from 'coinkraal-service';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import 'react-day-picker/lib/style.css';
import './css/bootstrap-theme.css';
import './css/app.css';
import './css/loader.css';

import App from './components/App';
import Global from './global';

import AuthStore from './stores/authStore';
import TokenStore from './stores/tokenStore';
import TransactionStore from './stores/transactionStore';
import CommonStore from './stores/commonStore';
import CoinStore from './stores/coinStore';
import SocialStore from './stores/socialStore';
import ExchangeStore from './stores/exchangeStore';
import PriceStore from './stores/priceStore';
import UserStore from './stores/userStore';

import PortfolioPageState from './components/portfolio/PortfolioPageState';
import TransactionsPageState from './components/transactions/TransactionsPageState'
import CoinsPageState from './components/coins/CoinsPageState'

promiseFinally.shim();
useStrict(true);

//Stores
let tokenStore = new TokenStore();
let agent = new Agent('', tokenStore.authorizeRequest, tokenStore.handleHttpErrors);
let authStore = new AuthStore(agent, tokenStore);
let transactionStore = new TransactionStore(agent);
let commonStore = new CommonStore();
let coinStore = new CoinStore(agent);
let socialStore = new SocialStore(agent);
let exchangeStore = new ExchangeStore(agent);
let priceStore = new PriceStore(agent, transactionStore);
let userStore = new UserStore(agent);

//Global
let global = new Global(tokenStore, coinStore, transactionStore, exchangeStore, userStore);

//Services
let utilityService = serviceFactory.utilityService();
let chartJsService = serviceFactory.chartJsService();
let portfolioChartService = serviceFactory.portfolioChartService();
let coinChartService = serviceFactory.coinChartService();
let transactionSummaryService = serviceFactory.transactionSummaryService();
let coinRiskChartService = serviceFactory.coinRiskChartService();

//PageState
let portfolioPageState = new PortfolioPageState(global, transactionStore, priceStore, portfolioChartService, transactionSummaryService, coinRiskChartService, chartJsService, utilityService);
let transactionsPageState = new TransactionsPageState(transactionStore);
let coinsPageState = new CoinsPageState(global, coinStore, transactionStore, coinChartService, chartJsService, utilityService);

//Chartjs Defaults - maybe move this somewhere else
defaults.global.defaultFontFamily = 'Roboto Mono';
defaults.global.defaultFontColor = '#f4f4f4';
defaults.global.tooltips.cornerRadius = 2;
defaults.global.tooltips.backgroundColor = 'rgba(233, 236, 239, 0.8)';
defaults.global.tooltips.titleFontColor = 'rgba(0, 0, 0, 1)';
defaults.global.tooltips.bodyFontColor = 'rgba(0, 0, 0, 1)';
defaults.global.tooltips.borderColor = 'rgba(0,0,0,1)';
defaults.global.tooltips.titleMarginBottom = 10;
defaults.global.tooltips.borderWidth = 1;
defaults.global.tooltips.bodySpacing = 6;
defaults.global.tooltips.xPadding = 10;
defaults.global.tooltips.yPadding = 10;
defaults.scale.gridLines.display = false;

//Start Load of App Data
global.loadApplicationData();

const props = {
  global,
  agent,
  utilityService,

  tokenStore,
  authStore,
  commonStore,
  transactionStore,
  coinStore,
  socialStore,
  exchangeStore,
  priceStore,
  userStore,

  portfolioPageState,
  transactionsPageState,
  coinsPageState,
};

ReactDOM.render(
  <Provider {...props}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
