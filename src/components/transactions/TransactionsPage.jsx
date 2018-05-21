import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import Loader from '../common/Loader'
import TransactionTableControls from './TransactionTableControls'
import TransactionTable from './TransactionTable'
import Layout from '../Layout'

@inject('tokenStore')
class TransactionsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout>
                {this.props.tokenStore.token &&
                    <div>
                        <div className="row justify-content-end mt-10">
                            <div className="col-auto">
                                <TransactionTableControls />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md">
                                <TransactionTable />
                            </div>
                        </div>
                    </div>
                }

                {!this.props.tokenStore.token &&
                    <div className="row">
                        <div className="col text-center mt-5">
                            <p>Please <Link to={`/login`}>signin</Link> to add transactions to your portfolio.</p>
                        </div>
                    </div>
                }
            </Layout>
        );
    }

}
export default TransactionsPage;