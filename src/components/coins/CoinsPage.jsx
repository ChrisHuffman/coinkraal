import React from 'react';
import { inject, observer } from 'mobx-react';
import CoinTable from './CoinTable'
import Layout from '../Layout'
import CoinTableControls from './CoinTableControls';
import GlobalData from '../common/GlobalData'

@inject('coinsPageState')
@observer
class CoinsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <div className="row mt-3 justify-content-between">
                    <div className="col-auto text-08">
                        <GlobalData />
                    </div>
                    <div className="col-auto">
                        <CoinTableControls />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <CoinTable />
                    </div>
                </div>
            </Layout>
        );
    }
}
export default CoinsPage;