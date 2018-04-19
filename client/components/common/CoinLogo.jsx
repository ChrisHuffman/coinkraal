import React from 'react';

class CoinLogo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            coin: null
        }
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.coin || nextProps.coin == this.props.coin)
            return;

        this.setState({
            coin: nextProps.coin
        });
    }

    render() {

        var coin = this.props.coin;

        if(!coin)
            return (<div />)

        var url = `/api/coins/${coin}/logo`;

        return (
            <img src={url} width={21} height={21} />
        )
    }
}
export default CoinLogo;