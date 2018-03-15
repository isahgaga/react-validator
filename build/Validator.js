'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Validator = function (_Component) {
    _inherits(Validator, _Component);

    function Validator(props) {
        _classCallCheck(this, Validator);

        var _this = _possibleConstructorReturn(this, (Validator.__proto__ || Object.getPrototypeOf(Validator)).call(this, props));

        _this.state = { all: new Set(), rules: {}, err: {}, msg: {} };
        return _this;
    }

    _createClass(Validator, [{
        key: 'validateField',
        value: function validateField(field) {
            var _this2 = this;

            var res = {};
            var name = field.name,
                value = field.value;

            var errors = [];
            var rules = this.getFieldRUles.call(this, name) || [];

            // return early 
            if (rules.length < 1) {
                return;
            }

            // handle required condition 
            var failsRequired = rules.indexOf('required') ? this.validateRule.call(this, 'required', value, name, field) : false;
            if (failsRequired) {
                return failsRequired;
            }

            // validate rest of the fields' constraints 
            rules.forEach(function (rule) {
                var error = _this2.validateRule.call(_this2, rule, value, name, field);
                if (error) {
                    res[name] = error;
                    errors.push(error);
                }
                return;
            });

            if (errors.length > 0) {
                res[name] = errors[0];
            } else {
                res[name] = '';
                this.state.all.delete(name);
                this.setState({ err: _extends({}, this.state.err, res) });
                return;
            }
            this.setState({
                err: _extends({}, this.state.err, res, { all: this.state.all.add(name) })
            });
            return;
        }
    }, {
        key: 'validateMultipleFields',
        value: function validateMultipleFields(fields) {
            var _this3 = this;

            var fieldType = typeof fields === 'undefined' ? 'undefined' : _typeof(fields);
            var res = {};

            if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) !== "object") {
                throw 'wrong type passed to validator as first parameter. Expected Array but got ' + fieldType;
                return;
            }

            fields.forEach(function (field) {
                var name = field.name,
                    value = field.value;

                var errors = [];
                var rules = _this3.getFieldRUles.call(_this3, name) || [];

                if (rules.length < 1) {
                    return;
                }

                // handle required condition 
                var failsRequired = rules.indexOf('required') ? _this3.validateRule.call(_this3, 'required', value, name, field) : false;
                if (failsRequired) {
                    return failsRequired;
                }

                rules.forEach(function (rule) {
                    var error = _this3.validateRule.call(_this3, rule, value, name, field);
                    if (error) {
                        errors.push(error);
                        return;
                    }
                    return;
                });

                if (errors.length > 0) {
                    res[name] = errors[0];
                    _this3.setState({ err: _extends({}, _this3.state.err, res, { all: _this3.state.all.add(name) }) });
                }
                _this3.setState({ err: _extends({}, _this3.state.err, res) });
                return;
            });

            return this.state.all.size > 0;
        }
    }, {
        key: 'validateRule',
        value: function validateRule(rule, value, name, field) {
            var error = this.validate.call(this, rule, value, field);
            return error ? this.getErrorMsg.call(this, rule, name) : null;
        }
    }, {
        key: 'validate',
        value: function validate(rule, value) {
            var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var error = null;
            if (rule === "required") {
                if (value === '' || value === ' ') {
                    return rule;
                }
                return error;
            }

            if (rule.substr(0, 3) === 'max') {
                var len = rule.substr(4);
                return value.length > len ? rule : error;
            }

            if (rule.substr(0, 3) === 'min') {
                var _len = rule.substr(4);
                return value.length < _len ? rule : error;
            }

            if (rule === 'string') {

                return (/^[-/+]?[+0-9]+$/.test(value) === true ? rule : error
                );
            }
            if (rule === 'email') {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var test = re.test(value);
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
                if (value !== fields.password) {
                    return rule;
                }
                return error;
            }
            if (rule === 'number') {
                var reg = /^\d+$/;
                var testr = reg.test(value);
                if (!testr && value.trim() !== '') {
                    return rule;
                }
                return error;
            }

            return error;
        }
    }, {
        key: 'getErrorMsg',
        value: function getErrorMsg(errorType, fieldName) {
            return this.state.msg[fieldName][errorType] || this.getDefaultErrorMsg.call(this, errorType, fieldName) || '';
        }
    }, {
        key: 'getDefaultErrorMsg',
        value: function getDefaultErrorMsg(error, name) {
            if (error === 'required') {
                return 'This field is required';
            }

            if (error === 'number') {
                return 'Please provide a valid number';
            }

            if (error.substr(0, 3) === 'max') {
                var len = error.substr(4);
                return 'The maximum length for the ' + name + ' is ' + len;
            }

            if (error.substr(0, 3) === 'min') {
                var _len2 = error.substr(4);
                return 'The minimum length for the ' + name + ' is ' + _len2;
            }

            if (error === 'string') {
                return 'Enter a correct ' + name;
            }

            if (error === 'email') {
                return 'Please provide a valid email address';
            }

            if (error === 'phoneNumber') {
                return 'Please provide a valid phonenumber';
            }

            if (error === 'match') {
                return 'confirm password does not match password';
            }
        }
    }, {
        key: 'getFieldRUles',
        value: function getFieldRUles(name) {
            return this.state.rules[name];
        }
    }, {
        key: 'setFormRules',
        value: function setFormRules(rules) {
            this.setState(function (prevState, props) {
                return { rules: rules };
            });
        }
    }, {
        key: 'setFormMessages',
        value: function setFormMessages(msg) {
            this.setState(function (prevState, props) {
                return { msg: msg };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var hasError = this.state.all.size > 0;

            var _state = this.state,
                all = _state.all,
                propsFromState = _objectWithoutProperties(_state, ['all']);

            var props = _extends({
                validateField: this.validateField.bind(this),
                validateMultipleFields: this.validateMultipleFields.bind(this),
                setFormMessages: this.setFormMessages.bind(this),
                setFormRules: this.setFormRules.bind(this),
                hasError: hasError
            }, propsFromState);
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                typeof this.props.render === 'function' && this.props.render(props)
            );
        }
    }]);

    return Validator;
}(_react.Component);

exports.default = Validator;