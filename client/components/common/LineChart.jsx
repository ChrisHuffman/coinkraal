import React from 'react';
import { Line } from 'react-chartjs-2';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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

        this.selectTimeRange = this.selectTimeRange.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
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

    hasData() {
        return this.state.data.datasets.length > 0;
    }

    render() {

        return (

            <div>

                <div className="row justify-content-end mt-1">

                    <div className="col-auto">

                        <Button outline={this.state.selectedTimeRange != 7} color="secondary" className="mr-3" size="xs" onClick={this.selectTimeRange.bind(null, 7)}>7d</Button>
                        <Button outline={this.state.selectedTimeRange != 30}  color="secondary" className="mr-3" size="xs" onClick={this.selectTimeRange.bind(null, 30)}>1m</Button>
                        <Button outline={this.state.selectedTimeRange != 90}  color="secondary" className="mr-3" size="xs" onClick={this.selectTimeRange.bind(null, 90)}>3m</Button>
                        <Button outline={this.state.selectedTimeRange != 180}  color="secondary" className="mr-3" size="xs" onClick={this.selectTimeRange.bind(null, 180)}>6m</Button>
                        <Button outline={this.state.selectedTimeRange != 365}  color="secondary" className="" size="xs" onClick={this.selectTimeRange.bind(null, 365)}>1y</Button>

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