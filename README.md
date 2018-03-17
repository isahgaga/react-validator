# react-validator
A simple react component for synchronous validation

## Installation

 ```
$ npm install input-validator-react --save-dev
```

## Usage 

```
//LoginForm.jsx

import React,{Component} from 'react'

class LoginForm extends Component{
   constructor(props){
        super(props);
        this.state={email:''}
    }
    componentDidMount() {
        const msg = {
            email: {
                required: 'Email is required'
            }
        }
        const rules = {
            email: ['required','email']
        }
        this.props.setFormMessages(msg);
        this.props.setFormRules(rules)
    }
    handleInputChange(e) {
        e.persist();
        this.setState((prevState, props) => ({email: e.target.value} ))
        this.props.validateField({ name: e.target.name, value: e.target.value })
    }
    submit(e){
        e.preventDefault();
        const hasError=this.props.validateMultipleFields([
            {name:"email",value:this.state.email}
        ]);
        if (hasError) {
            alert('error !')
            return;
        }
    }
    render(){
        return(
            <form>
              <div>
                <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleInputChange.bind(this)} />
              </div>
              <span>{this.props.err.email}</span>
            </form>
        )
    }
}
export default LoginForm
```

```
//App.js

import ReactDOM from 'react-dom';
import Validator from 'input-validator-react';
import LoginForm from './LoginForm';

ReactDOM.render( <Validator render={props=><LoginForm {...props} />} />, document.getElementById('root') ) 
```
