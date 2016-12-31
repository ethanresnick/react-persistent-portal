import React from "react";
import ReactDOM from "react-dom";
import Portal from "react-portal";
import classnames from 'classnames'

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
class PortalWithUnmountCallback extends Portal {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    // copied from Portal.prototype.closePortal; actually does the unmount
    const resetPortalState = () => {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
    };

    if(this.props.componentWillUnmount) {
      this.props.componentWillUnmount(resetPortalState);
    }
  }
}

export default (props) => {
  // Note that below we don't pass through to the portal the onClose prop
  // or the existingWrapperClassName, instaed replacing them with undefined.
  // This is because the class name is applied to the children and onClose is
  // used in beforeClose.
  return (
    <PortalWithUnmountCallback
      {...props}
      isOpened={true}
      componentWillUnmount={(resetPortalState) => {
        resetPortalState();
      }}
      beforeClose={(portalDomNode, resetPortalState) => {
        // Because the portal is technically now always "open", there are tons
        // of cases where the child will attempt to close it, when its already
        // "closed". E.g., because every click outside an open portal closes it
        // (if it's so configured), every click on a PersistentModal could
        // trigger a closePortal call. While we're never removing the portal
        // node from the DOM (which we'd do by calling resetPortalState), we
        // also shouldn't call the user's provided onClose either in these cases.
        if(props.isOpened && typeof props.onClose == "function") {
          props.onClose();
        }
      }}
      existingWrapperClassName={undefined}
      onClose={undefined}
      >
        {React.Children.only(
          React.cloneElement(props.children, {
            className: classnames(props.existingWrapperClassName, 'persistent-portal', {
              'persistent-portal--open': props.isOpened
            })
          })
        )}
    </PortalWithUnmountCallback>
  );
}
