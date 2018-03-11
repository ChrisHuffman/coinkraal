import React from 'react';
import { inject, observer } from 'mobx-react';
import CoinLogo from '../common/CoinLogo'
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('coinStore', 'commonStore')
@observer
class CoinSummary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: null
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.coin)
            return;

        this.setState({
            coin: nextProps.coin
        });
    }

    toggleModal() {
        this.props.coinStore.toggleCoinSummaryModal();
    }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.coinStore.coinSummaryModal} toggle={this.toggleModal} size='lg'>

                    <div className="modal-header">
                        <CoinLogo coin={this.state.coin ? this.state.coin.symbol : ""} />
                        <h5 className="modal-title ml-10">{this.state.coin ? this.state.coin.name : ""}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleModal}><span aria-hidden="true">&times;</span></button>
                    </div>
                  
                    <ModalBody>
                        TODO
                    </ModalBody>

                    <ModalFooter>
                        <Button outline color="light" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default CoinSummary;
