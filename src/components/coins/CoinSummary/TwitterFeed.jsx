import React from 'react';
import { inject, observer } from 'mobx-react';

@observer
class TwitterFeed extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            twitterUrl: props.twitterUrl
        }
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.twitterUrl || nextProps.twitterUrl == this.props.twitterUrl)
            return;

        this.setState({
            twitterUrl: nextProps.twitterUrl
        }, twttr.widgets.load);
    }

    render() {

        return (
            <div>
                {!this.state.twitterUrl &&
                    <span>No twitter feed.</span>
                }

                {this.state.twitterUrl &&
                    <div className="row justify-content-lg-center">
                        <div className="col col-lg-6">
                            <a className="twitter-timeline text-muted" data-dnt="true" data-theme="dark" data-link-color="#067bc2" href={this.state.twitterUrl}>loading...</a>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
export default TwitterFeed;

