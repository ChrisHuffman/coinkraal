import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = __API_ROOT__;

const encode = encodeURIComponent;

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    authStore.signout();
  }
  return err;
};

const responseBody = res => res.body;

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
  login: (googleTokenId) =>
    requests.post('/auth/signin', { token: googleTokenId })
};

const Transactions = {
  getTransactions: () => requests.get(`/api/transactions`),
  add: transaction => requests.post('/api/transactions/add', transaction),
  update: transaction => requests.put('/api/transactions/update', transaction),
  remove: transactionId => requests.del(`/api/transactions/remove?id=${transactionId}`)
};

const Sales = {
  getSales: (transactionId) => requests.get(`/api/transactions/${transactionId}/sales`),
  add: (transactionId, sale) => requests.post(`/api/transactions/${transactionId}/sales/add`, sale),
  update: (transactionId, sale) => requests.put(`/api/transactions/${transactionId}/sales/update`, sale),
  remove: (transactionId, saleId) => requests.del(`/api/transactions/${transactionId}/sales/remove?id=${saleId}`)
};

export default {
  Auth,
  Transactions,
  Sales
};
