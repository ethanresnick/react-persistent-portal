"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactPortal = require("react-portal");

var _reactPortal2 = _interopRequireDefault(_reactPortal);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The normal react-portal component adds and removes its portal from the DOM
 * whenever the isOpened property is changed. This component, by comparison,
 * remains in the DOM at all times (at least until the component rendering the
 * portal is unmounted), and instead toggles a class on a wrapper div in the
 * ported content to reflect whether the portal is open or not. The advantage
 * of this is that it makes it possible to use CSS transitions to animate the
 * portal both in and out. (If the element actually leaves the DOM, CSS has no
 * way to animate it out.) A more conventional, and potentially more robust,
 * approach would be to use ReactCSSTranstitionGroup, but that doesn't seem to
 * play well with react-portal.
 *
 * This component's exposed API doesn't allow the `beforeClose` option that
 * standard portals do; instead it always accepts `onClose`. Also, their must
 * only be one (possibly wrapper) element being ported, and any classes to
 * include on it beyond the portal-portal ones must be provided in the
 * existingWrapperClassName prop. Other than that, the allowed props are the
 * same as the standard portal.
 *
 * Note: react-portal expects that, if the user provides a beforeClose function,
 * that function will call a react-portal provided callback to remove the modal
 * from the DOM and reset react-portal's state. We're just not calling that cb.
 * So far, that doesn't seem to be causing any problems, but it is an invariant
 * violation that could come back to bite us in subtle ways -- hence the
 * encapsulation of that logic in this component, so we can easily replace it
 * with something better when that something comes along.
 */

/**
 * The standard react-portal, but call an extra, user provided callback
 * just before unmount. Used to finally remove the portal from the dom when
 * the portal component itself is being unmounted. Just a helper class.
 */
var PortalWithUnmountCallback = function (_Portal) {
  _inherits(PortalWithUnmountCallback, _Portal);

  function PortalWithUnmountCallback(props) {
    _classCallCheck(this, PortalWithUnmountCallback);

    return _possibleConstructorReturn(this, (PortalWithUnmountCallback.__proto__ || Object.getPrototypeOf(PortalWithUnmountCallback)).call(this, props));
  }

  _createClass(PortalWithUnmountCallback, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this2 = this;

      _get(PortalWithUnmountCallback.prototype.__proto__ || Object.getPrototypeOf(PortalWithUnmountCallback.prototype), "componentWillUnmount", this).call(this);

      // copied from Portal.prototype.closePortal; actually does the unmount
      var resetPortalState = function resetPortalState() {
        if (_this2.node) {
          _reactDom2.default.unmountComponentAtNode(_this2.node);
          document.body.removeChild(_this2.node);
        }
        _this2.portal = null;
        _this2.node = null;
      };

      if (this.props.componentWillUnmount) {
        this.props.componentWillUnmount(resetPortalState);
      }
    }
  }]);

  return PortalWithUnmountCallback;
}(_reactPortal2.default);

// Support browsers that don't support __proto__, namely IE 9/10.
// In these browsers, babel can't have PortalWithUnmountCallback automatically
// inherit Portal's static props, so we manually copy them over.


if (!({ __proto__: [] } instanceof Array)) {
  Object.keys(_reactPortal2.default).forEach(function (key) {
    if (key !== '__proto__') {
      PortalWithUnmountCallback[key] = _reactPortal2.default[key];
    }
  });
}

var PersistentPortal = function (_React$Component) {
  _inherits(PersistentPortal, _React$Component);

  function PersistentPortal(props) {
    _classCallCheck(this, PersistentPortal);

    var _this3 = _possibleConstructorReturn(this, (PersistentPortal.__proto__ || Object.getPrototypeOf(PersistentPortal)).call(this, props));

    _this3.portalComponent;
    return _this3;
  }

  // call onOpen ourselves at more select times to account
  // for the fact that the portal is always technically open.


  _createClass(PersistentPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.isOpened && this.props.onOpen) {
        this.props.onOpen(this.portalComponent && this.portalComponent.node);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.isOpened && !this.props.isOpened && nextProps.onOpen) {
        nextProps.onOpen(this.portalComponent && this.portalComponent.node);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      // Note that below we don't pass through to the portal the onClose, onOpen,
      // or the existingWrapperClassName props, instead sending in undefined.
      // For onOpen and onClose, this is because we call them ourselves at select
      // times and don't want the library to call them too. And for the className
      // prop, it's because we also apply it manually.
      return _react2.default.createElement(
        PortalWithUnmountCallback,
        _extends({}, this.props, {
          isOpened: true,
          ref: function ref(it) {
            _this4.portalComponent = it;
          },
          componentWillUnmount: function componentWillUnmount(resetPortalState) {
            resetPortalState();
          },
          beforeClose: function beforeClose(portalDomNode, resetPortalState) {
            // Because the portal is technically now always "open", there are tons
            // of cases where the child will attempt to close it, when its already
            // "closed". E.g., because every click outside an open portal closes it
            // (if it's so configured), every click on a PersistentModal could
            // trigger a closePortal call. While we're never removing the portal
            // node from the DOM (which we'd do by calling resetPortalState), we
            // also shouldn't call the user's provided onClose either in these cases.
            if (_this4.props.isOpened && typeof _this4.props.onClose == "function") {
              _this4.props.onClose();
            }
          },
          existingWrapperClassName: undefined,
          onClose: undefined,
          onOpen: undefined
        }),
        _react2.default.Children.only(_react2.default.cloneElement(this.props.children, {
          className: (0, _classnames2.default)(this.props.existingWrapperClassName, 'persistent-portal', {
            'persistent-portal--open': this.props.isOpened
          })
        }))
      );
    }
  }]);

  return PersistentPortal;
}(_react2.default.Component);

exports.default = PersistentPortal;