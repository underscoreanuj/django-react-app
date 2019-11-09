import React, {Component} from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';
import moment from 'moment';


class PostForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.clearForm = this.clearForm.bind(this);

        this.state = {
            "title": null,
            "content": "",
            "draft": false,
            "publish": moment(new Date()).format('YYYY-MM-DD'),
            errors: {}
        }

        this.postTitleRef = React.createRef();
    }

    componentDidMount() {
        const {post} = this.props;
        if (post !== undefined) {
            this.setState({
                "title": post.title,
                "content": post.content,
                "draft": post.draft,
                "publish": moment(post.publish).format('YYYY-MM-DD')
            });
        } else {
            this.defaultState();
        }

        // this.postTitleRef.current.focus();
    }

    handleSubmit(event) {
        event.preventDefault();

        let data = this.state;
        
        const{post} = this.props;
        if (post !== undefined) {
            this.updatePost(data);
        } else {
            this.createPost(data);   
        }
    }

    handleInputChange(event) {
        event.preventDefault();
        
        let key = event.target.name;
        let value = event.target.value;

        this.setState({
            [key]: value
        })
    }

    handleDraftChange(event) {
        this.setState({
            draft: !this.state.draft
        })
    }

    defaultState() {
        this.setState({
            "title": null,
            "content": "",
            "draft": false,
            "publish": moment(new Date()).format('YYYY-MM-DD')
        });
    }

    clearForm(event) {
        if (event) {
            event.preventDefault();
        }

        this.postCreateForm.reset();
        this.defaultState();
    }

    createPost(data) {
        const endpoint = '/api/posts/';
        const csrfToken = cookie.load('csrftoken');

        let thisComp = this

        if (csrfToken !== undefined) {
            
          let lookupOptions = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
          }
      
          fetch(endpoint, lookupOptions)
          .then(function(response) {
            return response.json();
          }).then(function(responseData) {
            console.log(responseData);
            if (thisComp.props.newPostItemCreated) {
                thisComp.props.newPostItemCreated(responseData);
                thisComp.clearForm();
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
    
      }

    updatePost(data) {
        const {post} = this.props;

        const endpoint = `/api/posts/${post.slug}/`;
        const csrfToken = cookie.load('csrftoken');

        let thisComp = this

        if (csrfToken !== undefined) {
            
          let lookupOptions = {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
          }
      
          fetch(endpoint, lookupOptions)
          .then(function(response) {
            return response.json();
          }).then(function(responseData) {
            console.log(responseData);
            if (thisComp.props.postItemUpdated) {
                thisComp.props.postItemUpdated(responseData);
                thisComp.clearForm();
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
    
      }

    render() {
        const {title} = this.state;
        const {content} = this.state;
        const {publish} = this.state;

        const cancelClass = this.props.post === undefined ? "" : "d-none";

        return (
            <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
                <div className='form-group'>
                    <label for='title'>Title</label>
                    <input 
                    id='title'
                    name='title' 
                    type='text' 
                    value={title}
                    className='form-control' 
                    placeholder='Title' 
                    onChange={this.handleInputChange} 
                    ref={this.postTitleRef}
                    required='required' />
                </div>
                <div className='form-group'>
                    <label for='content'>Content</label>
                    <textarea 
                    id='content' 
                    name='content' 
                    value={content}
                    className='form-control' 
                    placeholder='Content' 
                    onChange={this.handleInputChange} 
                    required='required' />
                </div>
                <div className='form-group'>
                    <label for='draft'>
                    <input 
                    id='draft' 
                    name='draft' 
                    type='checkbox'
                    value={this.state.draft} 
                    checked={this.state.draft}
                    className='mr-2' 
                    onChange={this.handleDraftChange} />
                    Draft</label>
                </div>
                <div className='form-group'>
                    <label for='publish'>Date</label>
                    <input 
                    id='publish' 
                    name='publish' 
                    type='date' 
                    className='form-control' 
                    value={publish}
                    onChange={this.handleInputChange} 
                    required='required' />
                </div>
                <button className='btn btn-primary'>Save</button>
                <button className={`btn btn-primary ${cancelClass}`} onClick={this.clearForm}>Clear</button>
            </form>
        );
    }
}

export default PostForm;
