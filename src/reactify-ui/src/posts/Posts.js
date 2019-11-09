import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';

import PostInline from './PostInline';
import PostCreate from './PostCreate';


class Posts extends Component {


  constructor(props) {
    super(props);
    this.togglePostsListClass = this.togglePostsListClass.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);

  }

  state = {
    posts: [],
    postsListClass: "card",
  }

  loadPosts() {
    const endpoint = '/api/posts/';
    let thisComp = this
    let lookupOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(endpoint, lookupOptions)
    .then(function(response) {
      return response.json();
    }).then(function(responseData) {
      console.log(responseData);
      thisComp.setState({
        posts: responseData
      });
    }).catch(function(error) {
      console.log(error);
    });

  }

  componentDidMount() {
    this.setState({
      posts: [],
      postsListClass: "card",
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
    const csrfToken = cookie.load('csrftoken');

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Notes</h1>
        </header>

        <button onClick={this.togglePostsListClass}>Toogle View</button>

        {posts.length > 0 ? posts.map((postItem, index)=>{
          return (
            <PostInline post={postItem} eleClass={postsListClass} />
          )
        }) : <p>Empty here...</p>}

        {(csrfToken !== undefined && csrfToken !== null) ? 
        <div className='my-5'>
            <PostCreate newPostItemCreated={this.handleNewPost}/>
          </div>
        : ""}

        </div>
    );
  }
}

export default Posts;
