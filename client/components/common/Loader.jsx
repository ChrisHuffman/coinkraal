import React from 'react';
import axios from 'axios';

class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: props.visible };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.visible });  
    }

    render() {
        return (
            <div>
                { this.state.visible && <div id="loader"></div> }
            </div>
        )
    }
}
export default Loader;