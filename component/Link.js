'use strict';

const { PropTypes } = require('react');
const Link = require('../view/Link');

const predefinedStyles = {
  'action-xs': require('../style/link/link-action-xs.css'),
  'action-s': require('../style/link/link-action-s.css'),
  'action-m': require('../style/link/link-action-m.css'),
  'action-l': require('../style/link/link-action-l.css'),
  'link-xs': require('../style/link/link-link-xs.css'),
  'link-s': require('../style/link/link-link-s.css'),
  'link-m': require('../style/link/link-link-m.css'),
  'link-l': require('../style/link/link-link-l.css'),
  'normal-xs': require('../style/link/link-normal-xs.css'),
  'normal-s': require('../style/link/link-normal-s.css'),
  'normal-m': require('../style/link/link-normal-m.css'),
  'normal-l': require('../style/link/link-normal-l.css'),
};

class LinkComponent extends Link {
  /**
   * @return {object}
   */
  styles() {
    return predefinedStyles[this.props.theme + '-' + this.props.size];
  }
}

LinkComponent.defaultProps = {
  size: 's',
  theme: 'link',
  ...Link.defaultProps,
};

LinkComponent.propTypes = {
  size: PropTypes.oneOf([
    'xs',
    's',
    'm',
    'l',
  ]),
  theme: PropTypes.oneOf([
    'action',
    'link',
    'normal',
  ]),
  ...Link.propTypes,
};

LinkComponent.unwantedProps = [
  'size',
  'theme',
];

module.exports = LinkComponent;
