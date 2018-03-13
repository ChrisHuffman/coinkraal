import React from 'react';
import CoinTable from './CoinTable'
import Layout from '../Layout'

class CoinsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <CoinTable />
            </Layout>
        );
    }
}
export default CoinsPage;