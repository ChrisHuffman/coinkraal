import React from 'react';
import { Line, } from 'react-chartjs-2';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class LineChart extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: this.formatData(props.chart.data),
            options: this.formatOptions(props.chart.options),
            plugins: this.formatPlugins(props.chart.plugins),
            isLoading: true,

            fiatDropDownOpen: false,
            coinDropDownOpen: false,

            selectedTimeRange: props.filters.selectedTimeRange,
            timeRangeDropDownOpen: false,
        }

        this.toggleTimeRangeDropDown = this.toggleTimeRangeDropDown.bind(this);
        this.selectTimeRange = this.selectTimeRange.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
        this.getTimeRangeText = this.getTimeRangeText.bind(this);
        this.hasData = this.hasData.bind(this);
    }

    //Remove observables (some reason chart js doesnt like them)
    formatData(data) {

        if (!data || !data.labels)
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

    //Remove observables (some reason chart js doesnt like them)
    formatOptions(options) {

        if (!options)
            return {};

        options.scales.xAxes = options.scales.xAxes.map(x => x);
        options.scales.yAxes = options.scales.yAxes.map(y => y);

        return options;
    }

    //Remove observables (some reason chart js doesnt like them)
    formatPlugins(plugins) {

        if (!plugins)
            return [];

        return plugins.map(p => p);
    }

    componentWillReceiveProps(nextProps) {

        //Dont need this for now...
        return;

        // if (!nextProps.chart)
        //     return;

        // this.setState({
        //     data: this.formatData(nextProps.chart.data),
        //     options: this.formatData(nextProps.chart.options),
        //     plugins: this.formatData(nextProps.chart.plugins)
        // });
    }

    toggleTimeRangeDropDown() {
        this.setState({
            timeRangeDropDownOpen: !this.state.timeRangeDropDownOpen
        });
    }

    selectTimeRange(timeRange) {
        this.setState({
            selectedTimeRange: timeRange
        }, this.onFiltersChanged);
    }

    onFiltersChanged() {

        if (!this.props.onFiltersChanged)
            return;

        this.props.onFiltersChanged({
            selectedTimeRange: this.state.selectedTimeRange
        });
    }

    getTimeRangeText() {

        switch (this.state.selectedTimeRange) {
            case 7:
                return 'Last 7 Days';
            case 30:
                return 'Last Month';
            case 90:
                return 'Last 3 Months';
            case 180:
                return 'Last 6 Months';
            case 365:
                return 'Last Year';
        }
    }

    hasData() {
        return this.state.data.datasets.length > 0;
    }

    render() {

        return (

            <div>

                <div className="row justify-content-end">

                    <div className="col-auto">

                        <ButtonDropdown color="dark" isOpen={this.state.timeRangeDropDownOpen} toggle={this.toggleTimeRangeDropDown}>
                            <DropdownToggle caret>
                                {this.getTimeRangeText()}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.selectTimeRange.bind(null, 7)}>Last 7 Days</DropdownItem>
                                <DropdownItem onClick={this.selectTimeRange.bind(null, 30)}>Last Month</DropdownItem>
                                <DropdownItem onClick={this.selectTimeRange.bind(null, 90)}>Last 3 Months</DropdownItem>
                                <DropdownItem onClick={this.selectTimeRange.bind(null, 180)}>Last 6 Months</DropdownItem>
                                <DropdownItem onClick={this.selectTimeRange.bind(null, 365)}>Last Year</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>

                    </div>

                </div>

                <div className="row">
                    {this.hasData() && 
                    <div className="col">
                        <Line
                            data={this.state.data}
                            options={this.state.options}
                            plugins={this.state.plugins} />
                    </div>
                    }

                    {!this.hasData() && 
                    <div className="col text-center text-danger pt-5">
                        <h3>No data</h3>
                    </div>
                    }

                </div>

            </div>
        );
    }
}
export default LineChart;