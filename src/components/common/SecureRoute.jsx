import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('tokenStore')
@observer
export default class SecureRoute extends React.Component {
  render() {

    const { tokenStore, ...restProps } = this.props;

    if (tokenStore.token) 
        return <Route {...restProps} />;

    return <Redirect to="/login" />;
  }
}