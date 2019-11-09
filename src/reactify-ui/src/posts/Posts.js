import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

import PostInline from './PostInline';


class Posts extends Component {


  constructor(props) {
    super(props);
    this.togglePostsListClass = this.togglePostsListClass.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);

    this.state = {
      posts: [],
      postsListClass: "card",
      next: null,
      prev: null,
      author: false,
      count: 0
    }

  }

  loadPosts(next_url) {
    
    let endpoint = '/api/posts/';
    if (next_url !== undefined) {
      endpoint = next_url;
    }

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

      thisComp.setState({
        posts: thisComp.state.posts.concat(responseData.results),
        next: responseData.next,
        prev: responseData.prev,
        author: responseData.author,
        count: responseData.count
      });

    }).catch(function(error) {
      console.log(error);
    });

  }

  loadMorePosts() {
    const {next} = this.state;

    if (next !== null && next !== undefined) {
      this.loadPosts(next);
    }
  }

  componentDidMount() {
    this.setState({
      posts: [],
      postsListClass: "card",
      next: null,
      prev: null,
      author: false,
      count: 0
    })
    this.loadPosts();
  }

  togglePostsListClass(event) {

    event.preventDefault();

    let currentListClass = this.state.postsListClass;
    if (currentListClass === "") {
      this.setState({
        postsListClass: "card",
      });
    } else {
      this.setState({
        postsListClass: "",
      });
    }
  }

  handleNewPost(postItemData) {
    console.log(postItemData);
    let currentPosts = this.state.posts;
    currentPosts.unshift(postItemData);
    this.setState({
      posts: currentPosts
    });
  }

  render() {

    const {posts} = this.state;
    const {postsListClass} = this.state;
    const {author} = this.state;
    const {next} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Notes</h1>
        </header>

        <button onClick={this.togglePostsListClass}>Toogle View</button>
        
        {author === true ? 
          <Link className='mr-2' maintainScrollPosition={false} to={{
            pathname: `/posts/create`,
            state: {fromDashboard: false}
        }}>Create Post</Link>  
        
        : ""}

        {posts.length > 0 ? posts.map((postItem, index)=>{
          return (
            <PostInline post={postItem} eleClass={postsListClass} />
          )
        }) : <p>Empty here...</p>}

        {(next !== null && next !== undefined) ? 
          <button onClick={this.loadMorePosts}>more...</button>
        : ""}

        </div>
    );
  }
}

export default Posts;
