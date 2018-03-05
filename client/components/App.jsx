import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import Home from './Home'
import Login from './common/Login'
import SecureRoute from './common/SecureRoute'

@withRouter
@observer
export default class App extends React.Component {

  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <SecureRoute path="/" component={Home} />
        </Switch>
      </div>
    );
 
  }
}