import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Validator extends Component {
    constructor(props) {
        super(props);
        this.state = { all: new Set(), rules: {}, err: {}, msg: {} }
    }
    validateField(field) {
        const res = {};
        const { name, value } = field;
        const errors = [];
        const rules = this.getFieldRUles.call(this, name) || [];

        // return early 
        if (rules.length < 1) {
            return;
        }

        // handle required condition 
        const failsRequired = rules.indexOf('required') ? this.validateRule.call(this, 'required', value, name, field) : false;
        if (failsRequired) {
            return failsRequired;
        }

        // validate rest of the fields' constraints 
        rules.forEach(rule => {
            const error = this.validateRule.call(this, rule, value,name, field);
            if (error) {
                res[name] = error;
                errors.push(error);
            }
            return;
        });

        if (errors.length > 0) {
            res[name] = errors[0];
        }
        else {
            res[name] = '';
            this.state.all.delete(name);
            this.setState({ err: { ...this.state.err, ...res } });
            return;
        }
        this.setState({
            err: { ...this.state.err, ...res, all: this.state.all.add(name) }
        });
        return;
    }
    validateMultipleFields(fields) {
        const fieldType = typeof fields;
        const res = {};

        if (typeof fields !== "object") {
            throw (`wrong type passed to validator as first parameter. Expected Array but got ${fieldType}`);
            return;
        }

        fields.forEach(field => {
            const { name, value } = field;
            const errors = [];
            const rules = this.getFieldRUles.call(this, name) || [];

            if (rules.length < 1) {
                return;
            }


            // handle required condition 
            const failsRequired = rules.indexOf('required') ? this.validateRule.call(this, 'required', value, name, field) : false;
            if (failsRequired) {
                return failsRequired;
            }

            rules.forEach(rule => {
                const error = this.validateRule.call(this, rule, value,name, field);
                if (error) {
                    errors.push(error);
                    return
                }
                return;
            });

            if (errors.length > 0) {
                res[name] = errors[0];
                this.setState({ err: { ...this.state.err, ...res, all: this.state.all.add(name) } });
            }
            this.setState({ err: { ...this.state.err, ...res } });
            return;

        });

        return this.state.all.size > 0;
    }
    validateRule(rule, value, name, field) {
        const error = this.validate.call(this,rule, value, field);
        return error ? this.getErrorMsg.call(this,rule, name) : null;
    }
    validate(rule, value, fields = null) {
        let error = null;
        if (rule === "required") {
            if (value === '' || value === ' ') {
                return rule;
            }
            return error;
        }

        if (rule.substr(0, 3) === 'max') {
            const len = rule.substr(4);
            return value.length > len ? rule : error;
        }

        if (rule.substr(0, 3) === 'min') {
            const len = rule.substr(4);
            return value.length < len ? rule : error;
        }

        if (rule === 'string') {

            return /^[-/+]?[+0-9]+$/.test(value) === true ? rule : error;
        }
        if (rule === 'email') {
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let test = re.test(value);
            if (!test) {
                return rule;
            }
            return error;
        }
        if (rule === 'phoneNumber') {
            var phoneno = /^\d{11}$/;
            if (!value.match(phoneno) && value.trim() !== '') {
                return rule;
            }
            return error;
        }
        if (rule === 'match') {
            if (value !== fields.match) {
                return rule;
            }
            return error;
        }
        if (rule === 'number') {
            let reg = /^\d+$/;
            let testr = reg.test(value);
            if (!testr && value.trim() !== '') {
                return rule;
            }
            return error;
        }

        return error;

    }
    getErrorMsg(errorType, fieldName) {
        return this.state.msg[fieldName][errorType] || this.getDefaultErrorMsg.call(this, errorType, fieldName) || '';
    }
    getDefaultErrorMsg(error, name) {
        if (error === 'required') {
            return `This field is required`;
        }

        if (error === 'number') {
            return `Please provide a valid number`;
        }

        if (error.substr(0, 3) === 'max') {
            const len = error.substr(4);
            return `The maximum length for the ${name} is ${len}`;
        }

        if (error.substr(0, 3) === 'min') {
            const len = error.substr(4);
            return `The minimum length for the ${name} is ${len}`;
        }

        if (error === 'string') {
            return `Enter a correct ${name}`;
        }

        if (error === 'email') {
            return `Please provide a valid email address`;

        }

        if (error === 'phoneNumber') {
            return `Please provide a valid phonenumber`;
        }

        if (error === 'match') {
            return `confirm password does not match password`;
        }
    }
    getFieldRUles(name) {
        return this.state.rules[name];
    }
    setFormRules(rules) {
        this.setState((prevState, props) => ({ rules }))
    }
    setFormMessages(msg) {
        this.setState((prevState, props) => ({ msg }))
    }
    render() {
        const hasError = this.state.all.size > 0;
        const { all, ...propsFromState } = this.state;
        const props = {
            validateField: this.validateField.bind(this),
            validateMultipleFields: this.validateMultipleFields.bind(this),
            setFormMessages: this.setFormMessages.bind(this),
            setFormRules: this.setFormRules.bind(this),
            hasError,
            ...propsFromState
        }
        return (
            <React.Fragment>
                {
                    typeof this.props.render === 'function' && this.props.render(props)
                }
            </React.Fragment>
        )
    }
}
export default Validator;