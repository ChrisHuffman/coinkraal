import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('authStore')
@observer
export default class SecureRoute extends React.Component {
  render() {

    const { authStore, ...restProps } = this.props;

    if (authStore.token) 
        return <Route {...restProps} />;

    return <Redirect to="/login" />;
  }
}