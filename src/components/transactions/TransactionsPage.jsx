import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button } from 'reactstrap';
import Loader from '../common/Loader'
import TransactionTableControls from './TransactionTableControls'
import TransactionTable from './TransactionTable'
import Layout from '../Layout'

class TransactionsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout>
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
            </Layout>
        );
    }

}
export default TransactionsPage;