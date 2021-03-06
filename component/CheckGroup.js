'use strict';

const {Component} = require('react');
const {assign, map, noop} = require('../lib/dash');
const {omitNonStandardAttrs, genericName, isControlled} = require('../lib/util');
const Box = require('../view/Box');
const PropTypes = require('prop-types');
const React = require('react');
const cc = require('classnames');
const chunk = require('lodash.chunk');

const cssModules = {
  l: require('../style/checkGroup/checkGroup-l.css'),
  m: require('../style/checkGroup/checkGroup-m.css'),
};

class CheckGroup extends Component {
  constructor(props) {
    super(props);

    this._controlled = isControlled(props);

    const checkItems = this._checkItems = calculateCheckItems(props.options);
    const value = this._controlled
      ? props.value
      : props.defaultValue;

    this.state = {
      values: mapValueToState(checkItems, value || []),
    };
  }

  componentWillReceiveProps(nextProps) {
    this._controlled = isControlled(nextProps);

    const {options, value} = this.props;

    if (
      this._controlled && nextProps.value !== value ||
      nextProps.options !== options
    ) {
      this._checkItems = calculateCheckItems(nextProps.options);
      const values = mapValueToState(this._checkItems, nextProps.value || []);

      this.setState({values});
    }
  }

  css = tokenName => genericName(this.props, tokenName)

  focus = noop

  _onChange = (e, {checked}, position) => {
    const values = updateValue(this.state.values, position, checked);

    if (!this._controlled) this.setState({values});

    this.props.onChange(e, {
      name: this.props.name,
      value: mapStateToValue(this._checkItems, values),
    });
  }

  computeChecks(checkItems) {
    const {disabled, name} = this.props;
    const {values} = this.state;

    const styles = this.css();

    return map(item =>
      this.renderCheck({
        ...item,
        checked: values[item._position],
        disabled: item.disabled || disabled,
        key: `${item._position}${item.value}`,
        name,
        onChange: this._onChange,
        position: item._position,
        styles,
      }), checkItems);
  }

  computeColumns(checks) {
    const {cols} = this.props;
    const chunkSize = Math.ceil(this._checkItems.length / cols);
    const columns = chunk(checks, chunkSize);
    const className = this.css('column');

    let index = 0;

    return map(children =>
      this.renderColumn({
        children,
        className,
        key: ++index,
      }), columns);
  }

  render() {
    const {className, id} = this.props;
    const {css} = this;

    const checks = this.computeChecks(this._checkItems);
    const columns = this.computeColumns(checks);

    return (
      <div
        {...omitNonStandardAttrs(this.props)}
        className={cc(css('container'), className)}
        id={id}
        onChange={void 0}>
        {columns}
      </div>
    );
  }

  renderColumn(columnProps) {
    return (
      <div {...columnProps}/>
    );
  }

  renderCheck(checkProps) {
    return (
      <Box {...checkProps}/>
    );
  }
}

CheckGroup.defaultProps = {
  cols: 1,
  onChange: noop,
  size: 'm',
  styles: cssModules,
};

CheckGroup.propTypes = {
  className: PropTypes.string,
  cols: PropTypes.number,
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  size: PropTypes.oneOf([
    'l',
    'm',
  ]),
  styles: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.string),
};

module.exports = CheckGroup;

// calculateMenuItems :: (a -> q -> bool) -> [a] -> q -> [b]
function calculateCheckItems(items = []) {
  const length = items.length;
  const nextItems = Array(length);

  for (let i = 0; i < length; ++i)
    nextItems[i] = assign(items[i], {_position: i});

  return nextItems;
}

function mapStateToValue(options, values) {
  const selected = [];

  for (let i = 0; i < values.length; ++i)
    if (values[i]) selected.push(options[i].value);

  return selected;
}

function mapValueToState(options, selected) {
  const selectedMap = {};
  let length = selected.length;

  while (length--) selectedMap[selected[length]] = null;

  return map(({value}) => value in selectedMap, options);
}

function updateValue(values, position, target) {
  return values.map((value, i) => position !== i ? value : target);
}
