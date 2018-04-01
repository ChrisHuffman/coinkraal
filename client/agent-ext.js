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

//This fix function is needed because CryptoCompare and CoinMarketCap use different symbols for some coins .... meh
const fixSyms = (symbols) => {
  return symbols.map(fixSym);
}

const fixSym = (symbol) => {
  if (symbol == 'MIOTA') return 'IOTA';
  if (symbol == 'NANO') return 'XRB';
  return symbol;
}

const fixSymInv = (symbol) => {
  if (symbol == 'IOTA') return 'MIOTA';
  if (symbol == 'XRB') return 'NANO';
  return symbol;
}

const responseBody = res => res.body;

const requests = {
  get: url =>
    superagent
      .get(`${url}`)
      .end(handleErrors)
      .then(responseBody)
};

const External1 = {
  getHistoricalPrice: (fromCurrency, toCurrency, timestamp) => requests.get(`${API_ROOT1}/data/pricehistorical?fsym=${fixSym(fromCurrency)}&tsyms=${fixSym(toCurrency)}&ts=${timestamp}`).then(body => body[fixSym(fromCurrency)][fixSym(toCurrency)]),
  getDailyHistoricalPrice: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/histoday?fsym=${fixSym(fromCurrency)}&tsym=${fixSym(toCurrency)}&limit=${limit}`).then(body => body.Data),
  getHourlyHistoricalPrice: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/histohour?fsym=${fixSym(fromCurrency)}&tsym=${fixSym(toCurrency)}&limit=${limit}`).then(body => body.Data),
  get24HrPriceChange: (fromCurrency, toCurrency) => requests.get(`${API_ROOT1}/data/pricemultifull?fsyms=${fixSym(fromCurrency)}&tsyms=${fixSym(toCurrency)}`).then(body => body.RAW[fixSym(fromCurrency)] ? body.RAW[fixSym(fromCurrency)][fixSym(toCurrency)].CHANGEPCT24HOUR : null),
  getCoinExchanges: (fromCurrency, toCurrency, limit) => requests.get(`${API_ROOT1}/data/top/exchanges/full?fsym=${fixSym(fromCurrency)}&tsym=${fixSym(toCurrency)}&limit=${limit}`).then(body => body.Data.Exchanges),
  getPrice: (fromCurrency, toCurrencies) => requests.get(`${API_ROOT1}/data/price?fsym=${fixSym(fromCurrency)}&tsyms=${fixSyms(toCurrencies).join(',')}`)
    .then(data => {
        var d = {};
        for (var s in data) {
            if (data.hasOwnProperty(s)) {
                d[fixSymInv(s)] = data[s];
            }
        }
        return d;
    })
};

const External2 = {
  getCoinTopList: (start, limit) => requests.get(`${API_ROOT2}/ticker/?start=${start}&limit=${limit}`)
};

export default {
  External1,
  External2
};
