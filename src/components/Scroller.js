import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';

class Scroller extends Component {
  constructor(props) {
    super(props);

    this.scrollable = props.forwardedRef || React.createRef();
  }

  handleScroll = () => {
    if (!this.scrollable.current) { return; }
    const element = this.scrollable.current;
    const scrollTop = element.scrollTop;
    const maxScrollPosition = element.scrollHeight - element.clientHeight;
    const scrollAmount = scrollTop / maxScrollPosition;

    this.props.onScroll(scrollTop, scrollAmount);
  }

  render() {
    const {
      className,
      children,
      showScrollbars,
      useSmoothScrolling,
    } = this.props;

    return (
      <div
        className={cx('scrollable', { 'scrollable--show-scrollbars': showScrollbars }, className)}
        onScroll={this.handleScroll}
        style={{ scrollBehavior: useSmoothScrolling ? 'smooth' : 'unset' }}
        ref={this.scrollable}
      >
        {children}
      </div>
    );
  }
}

Scroller.defaultProps = {
  className: '',
  onScroll: () => {},
  useSmoothScrolling: true,
};

Scroller.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  onScroll: PropTypes.func,
  showScrollbars: PropTypes.bool.isRequired,
  useSmoothScrolling: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    showScrollbars: state.deviceSettings.showScrollbars,
  };
}

export default connect(mapStateToProps)(Scroller);
