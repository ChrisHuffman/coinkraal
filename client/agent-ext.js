import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT1 = 'https://min-api.cryptocompare.com';
const API_ROOT2 = 'https://api.coinmarketcap.com/v1';

const encode = encodeURIComponent;

const handleErrors = err => {
  if (err && err.response) {
    console.log(err);
  }
  return err;
};

const responseBody = res => res.body;

const requests = {
  get: url =>
    superagent
      .get(`${url}`)
      .end(handleErrors)
      .then(responseBody)
};

const External = {
  get: (url) => requests.get(`${url}`),
  getCoinDataList: () => requests.get(`${API_ROOT1}/data/all/coinlist`).then(body => body.Data),
  getPrice: (fromCurrency, toCurrencies) => requests.get(`${API_ROOT1}/data/price?fsym=${fromCurrency}&tsyms=${toCurrencies.join(',')}`),
  getHistoricalPrice: (fromCurrency, toCurrency, timestamp) => requests.get(`${API_ROOT1}/data/pricehistorical?fsym=${fromCurrency}&tsyms=${toCurrency}&ts=${timestamp}`).then(body => body[fromCurrency][toCurrency]),
  getDailyHistoricalPrice: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/histoday?fsym=${fromCurrency}&tsym=${toCurrency}&limit=${limit}`).then(body => body.Data),
  getHourlyHistoricalPrice: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/histohour?fsym=${fromCurrency}&tsym=${toCurrency}&limit=${limit}`).then(body => body.Data),
  get24HrPriceChange: (fromCurrency, toCurrency) => requests.get(`${API_ROOT1}/data/pricemultifull?fsyms=${fromCurrency}&tsyms=${toCurrency}`).then(body => body.RAW[fromCurrency][toCurrency].CHANGEPCT24HOUR),
  getCoinExchanges: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/top/exchanges/full?fsym=${fromCurrency}&tsym=${toCurrency}&limit=${limit}`).then(body => body.Data.Exchanges),
  getCoinTopList: (start, limit) => requests.get(`${API_ROOT2}/ticker/?start=${start}&limit=${limit}`)
};

export default {
  External
};
