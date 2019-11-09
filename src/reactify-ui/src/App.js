import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import Posts from './posts/Posts';
import PostDetail from './posts/PostDetail';
import PostForm from './posts/PostForm';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/posts' component={Posts} />
          <Route exact path='/posts/create' component={PostForm} />
          <Route exact path='/posts/:slug' component={PostDetail} />
          <Route component={Posts} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
