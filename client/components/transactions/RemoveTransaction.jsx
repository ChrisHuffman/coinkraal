import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

@inject('transactionStore', 'commonStore')
@observer
class RemoveTransaction extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            enabled: true,
            modal: false
        }

        this.removeTransaction = this.removeTransaction.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    removeTransaction() {
        var self = this;
        self.enabled(false);
        this.props.transactionStore.removeTransaction(this.props.id)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {
                self.props.commonStore.notify('Error removing transaction', 'error');
            })
            .then(() => {
                self.enabled(true);
            });
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (
            <div>

                <Button outline color="light" size="xs" onClick={this.toggleModal}>X</Button>

                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Remove Transaction</ModalHeader>
                    <ModalBody>
                       
                       <h6>Are you sure you want to remove this transaction?</h6>

                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleModal} disabled={!this.state.enabled}>No</Button>
                        <Button outline color="danger" onClick={this.removeTransaction} disabled={!this.state.enabled}>Yes, nuke it</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default RemoveTransaction;
