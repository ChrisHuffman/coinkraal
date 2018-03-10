import React from 'react';

class CoinLogo extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            coin: nextProps.coin
        });
    }

    render() {

        var coin = this.props.coin;

        if(!coin)
            return (<div />)

        var url = __API_ROOT__ + `/api/coins/${coin}/logo`;

        return (
            <img src={url} width={21} height={21} />
        )
    }
}
export default CoinLogo;