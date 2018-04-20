import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '';

const encode = encodeURIComponent;

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    authStore.signout();
  }
  return err;
};

const responseBody = res => res.body;
const responseText = res => res.text;

const tokenPlugin = req => {
  if (authStore.token) {
    req.set('Authorization', `Bearer ${authStore.token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  getText: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseText),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};

const Auth = {
  googleLogin: (googleTokenId) =>
    requests.post('/auth/signin/google', { token: googleTokenId }),
  facebookLogin: (accessToken, email, userID, name, picture) =>
    requests.post('/auth/signin/facebook', { accessToken: accessToken, email: email, userId: userID, name: name, picture: picture })
};

const Transactions = {
  getTransactions: () => requests.get(`/api/transactions`),
  add: transaction => requests.post('/api/transactions/add', transaction),
  update: transaction => requests.put('/api/transactions/update', transaction),
  remove: transactionId => requests.del(`/api/transactions/remove?id=${transactionId}`)
};

const Sales = {
  add: (transactionId, sale) => requests.post(`/api/transactions/${transactionId}/sales/add`, sale),
  update: (transactionId, sale) => requests.put(`/api/transactions/${transactionId}/sales/update`, sale),
  remove: (transactionId, saleId) => requests.del(`/api/transactions/${transactionId}/sales/remove?id=${saleId}`)
};

const Coins = {
  getCoinLinks: (symbol) => requests.get(`/api/coins/${symbol}/links`),
  getCoinLogo: (symbol) => requests.get(`/api/coins/${symbol}/logo`),
  getGlobalData: () => requests.get(`/api/coins/globaldata`)
};

const Social = {
  getRedditContent: (url) => requests.getText(`/api/social/reddit?url=${encodeURIComponent(url)}`)
};

const User = {
  getUser: () => requests.get(`/api/user`).catch(err => { authStore.signout() }),
  updateSettings: (settings) => requests.post(`/api/user/settings`, settings)
};

export default {
  Auth,
  Transactions,
  Sales,
  Coins,
  Social,
  User
};
