import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import cookie from 'react-cookies';
import PostUpdate from './PostUpdate';


class PostDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slug: null,
            post: null,
            doneLoading: false,
        }
    }

    componentDidMount() {
        if (this.props.match) {
            const {slug} = this.props.match.params;
            this.setState({
                slug: slug,
                doneLoading: false,
            });

            this.loadPost(slug);
        }
    }

    loadPost(slug) {
        const endpoint = `/api/posts/${slug}/`;
        let thisComp = this
        let lookupOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }

        const csrfToken = cookie.load('csrftoken');

        if (csrfToken !== undefined) {
            lookupOptions['headers']['X-CSRFToken'] = csrfToken;
            lookupOptions['credentials'] = 'include';
        }
    
        fetch(endpoint, lookupOptions)
        .then(function(response) {
          return response.json();
        }).then(function(responseData) {
          console.log(responseData);
          if (responseData.detail) {
            thisComp.setState({
                doneLoading: true,
                post: null
              });
          } else {
            thisComp.setState({
                doneLoading: true,
                post: responseData
              });
          }
        }).catch(function(error) {
          console.log(error);
        });
    
      }

    render() {
        const {doneLoading} = this.state;
        const {slug} = this.state;
        const {post} = this.state;

        return (
            <p>
                {(doneLoading === true) ? 
                    <div>
                        {(post !== null) ?
                        <div>
                            <p className='lead'>
                            <Link maintainScrollPosition={false} to={{
                                pathname: `/posts`,
                                state: {fromDashboard: false}
                            }}>Home</Link>
                            </p>

                            <h1>{post.title}</h1>
                            {post.owner === true ? <div><PostUpdate post={post} /></div> : "" }
                            </div>
                        : <div>Not Found!!!</div> }
                    </div>
                : <div>Loading...</div> }
            </p>
        );
    }
}

export default PostDetail;
