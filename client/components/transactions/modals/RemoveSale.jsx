import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

@inject('transactionsPageState', 'transactionStore', 'commonStore')
@observer
class RemoveSale extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            enabled: true,
        }

        this.removeSale = this.removeSale.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    removeSale() {

        var self = this;
        self.enabled(false);

        self.props.transactionStore.removeSale(self.props.transactionsPageState.selectedTransaction._id, self.props.transactionsPageState.selectedSale._id)
            .then(function (response) {
               self.toggleModal();
            })
            .catch((error) => {
                console.log(error);
                self.props.commonStore.notify('Error removing sale', 'error');
            })
            .then(() => {
                self.enabled(true);
            });
    }

    toggleModal() {
        this.props.transactionsPageState.toggleRemoveSaleModal();
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.transactionsPageState.removeSaleModal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Remove Sale</ModalHeader>
                    <ModalBody>
                       
                       <h6>Are you sure you want to remove this sale?</h6>

                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleModal} disabled={!this.state.enabled}>No</Button>
                        <Button outline color="danger" onClick={this.removeSale} disabled={!this.state.enabled}>Yes, nuke it</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default RemoveSale;
