import React from 'react';
import { Line } from 'react-chartjs-2';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class PortfolioChart extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: this.formatData(props.data),
            isLoading: true,

            selectedFiat: props.filters.selectedFiat,
            fiatDropDownOpen: false,

            selectedCoin: props.filters.selectedCoin,
            coinDropDownOpen: false,
        }

        this.toggleFiatDropDown = this.toggleFiatDropDown.bind(this);
        this.selectFiat = this.selectFiat.bind(this);

        this.toggleCoinDropDown = this.toggleCoinDropDown.bind(this);
        this.selectCoin = this.selectCoin.bind(this);

        this.onFiltersChanged = this.onFiltersChanged.bind(this);

        this.getOptions = this.getOptions.bind(this);
    }

    formatData(data) {

        if (!data.labels)
            return {};

        return {
            labels: data.labels.map(l => l),
            datasets: data.datasets.map(ds => {
                return {
                    borderColor: ds.borderColor,
                    borderWidth: ds.borderWidth,
                    data: ds.data.map(d => d),
                    fill: ds.fill,
                    label: ds.label,
                    lineTension: ds.lineTension,
                    pointRadius: ds.pointRadius,
                    pointStyle: ds.pointStyle,
                    yAxisID: ds.yAxisID
                };
            })
        }

    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.data)
            return;

        this.setState({
            data: this.formatData(nextProps.data)
        });
    }

    toggleFiatDropDown() {
        this.setState({
            fiatDropDownOpen: !this.state.fiatDropDownOpen
        });
    }

    selectFiat(fiat) {
        this.setState({
            selectedFiat: fiat
        }, this.onFiltersChanged);
    }

    toggleCoinDropDown() {
        this.setState({
            coinDropDownOpen: !this.state.coinDropDownOpen
        });
    }

    selectCoin(coin) {
        this.setState({
            selectedCoin: coin
        }, this.onFiltersChanged);
    }

    onFiltersChanged() {

        if (!this.props.onFiltersChanged)
            return;

        this.props.onFiltersChanged({
            selectedFiat: this.state.selectedFiat,
            selectedCoin: this.state.selectedCoin
        });
    }

    getOptions() {

        return {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            legend: {
                labels: {
                    usePointStyle: true
                }
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
                cornerRadius: 2
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    ticks: {
                        //Might want to number format this
                        callback: function (value, index, values) {
                            return value;
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.selectedFiat
                    }
                }, {
                    type: 'linear', 
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    scaleLabel: {
                        display: true,
                        labelString: this.state.selectedCoin
                    }
                }],
            }
        };


    }

    render() {

        return (

            <div>

                <div className="row justify-content-end">

                    <div className="col-auto">

                        <ButtonDropdown isOpen={this.state.fiatDropDownOpen} toggle={this.toggleFiatDropDown}>
                            <DropdownToggle caret>
                                {this.state.selectedFiat ? this.state.selectedFiat : "<None>"}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.selectFiat.bind(null, '')}>&#x3C;None&#x3E;</DropdownItem>
                                <DropdownItem onClick={this.selectFiat.bind(null, 'USD')}>USD</DropdownItem>
                                <DropdownItem onClick={this.selectFiat.bind(null, 'ZAR')}>ZAR</DropdownItem>
                                <DropdownItem onClick={this.selectFiat.bind(null, 'GBP')}>GPB</DropdownItem>
                                <DropdownItem onClick={this.selectFiat.bind(null, 'AUD')}>AUD</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>

                    </div>

                    <div className="col-auto">

                        <ButtonDropdown isOpen={this.state.coinDropDownOpen} toggle={this.toggleCoinDropDown}>
                            <DropdownToggle caret>
                                {this.state.selectedCoin ? this.state.selectedCoin : "<None>"}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.selectCoin.bind(null, '')}>&#x3C;None&#x3E;</DropdownItem>
                                <DropdownItem onClick={this.selectCoin.bind(null, 'BTC')}>BTC</DropdownItem>
                                <DropdownItem onClick={this.selectCoin.bind(null, 'ETH')}>ETH</DropdownItem>
                                <DropdownItem onClick={this.selectCoin.bind(null, 'NEO')}>NEO</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>

                    </div>

                </div>

                <div className="row">

                    <div className="col">

                        <Line
                            data={this.state.data}
                            options={this.getOptions()} />
                    </div>

                </div>

            </div>
        );
    }
}
export default PortfolioChart;