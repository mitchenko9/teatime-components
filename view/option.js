'use strict';

const { Component, PropTypes } = require('react');
const { camelcase, bind } = require('../tools/func');
const { createTag, span } = require('../');
const classnames = require('classnames');
const cssModules = require('react-css-modules');

class Option extends Component {
  constructor(props) {
    super(props);

    bind(this, ['onClick', 'onMouseEnter']);
  }

  onClick(e) {
    this.props.onClick(e, this.props.identity);
  }

  onMouseEnter(e) {
    this.props.onMouseEnter(e, this.props.identity);
  }

  render() {
    const {
      focused,
      onClick, // eslint-disable-line no-unused-vars
      onMouseEnter, // eslint-disable-line no-unused-vars
      selected,
      value,
      ...o,
    } = this.props;

    return span({
      ...o,
      'data-value': value,
      onClick: this.onClick,
      onMouseEnter: this.onMouseEnter,
      styleName: camelcase(classnames('control', {
        focused,
        selected,
      })),
    });
  }
}

Option.defaultProps = {
  styles: {},
};

Option.propTypes = {
  focused: PropTypes.bool,
  identity: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  styles: PropTypes.object,
  value: PropTypes.string.isRequired,
};

module.exports = cssModules(Option);
module.exports.Option = createTag(module.exports);
