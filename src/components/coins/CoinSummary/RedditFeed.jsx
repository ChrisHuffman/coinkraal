import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('socialStore')
@observer
class RedditFeed extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            redditUrl: "",
            redditContent: {
                __html: ""
            }
        }

        this.loadRedditFeed = this.loadRedditFeed.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.redditUrl == this.props.redditUrl)
            return;

        this.loadRedditFeed(nextProps.redditUrl);
    }

    loadRedditFeed(redditUrl) {

        this.setState({
            redditUrl: "",
            redditContent: {
                __html: 'loading...'
            }
        });

        if (redditUrl) {
            //Load reddit content
            this.props.socialStore.getRedditContent(redditUrl)
                .then(content => {
                    this.setState({
                        redditContent: {
                            __html: content
                        }
                    });
                });
        }
        else {
            this.setState({
                redditContent: {
                    __html: 'No reddit feed.'
                }
            });
        }

    }

    render() {

        return (
            <div>
                <div dangerouslySetInnerHTML={this.state.redditContent} />
            </div>
        )
    }
}
export default RedditFeed;

