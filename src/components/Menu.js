import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { MenuContent } from '.';
import { SideMenu } from 'network-canvas-ui';
import { MenuItem } from './Elements';

/**
  * Renders a menu, updating styles on DOM elements outside of this.
  * @extends Component
  */
class MenuFactory extends Component {
  /**
    * adds listener for key events to close Menu
    */
  componentDidMount() {
    window.onkeydown = this.listenForClose;
  }

  /**
    * adds listener for key events to close Menu
    */
  componentWillUnmount() {
    window.onkeydown = null;
  }

  listenForClose = (e) => {
    const event = e || window.event;

    if (this.props.isOpen && (event.key === 'Escape' || event.keyCode === 27)) {
      this.props.toggleMenu();
    }
  }

  // intercepts click events; calls callback and toggles Menu open state
  menuItemClick = (itemClick) => {
    itemClick();
    this.props.toggleMenu();
  }

  render() {
    const { hideButton, isOpen, items, searchField, title, toggleMenu } = this.props;

    const menuItems = items.map(item =>
      (<MenuItem
        key={item.id}
        to={item.to}
        onClick={() => this.menuItemClick(item.onClick)}
        title={item.title}
        isActive={item.isActive}
        interfaceType={item.interfaceType}
      />),
    );

    return (
      <div className="menu">
        <div className={isOpen ? 'menu__wrap menu__wrap--isOpen' : 'menu__wrap'}>
          <div className="menu__content">
            <MenuContent
              items={menuItems}
              searchField={searchField}
              title={title}
              toggleMenu={toggleMenu}
            />
          </div>
        </div>
        {!hideButton && <div className="menu__burger">
          <button onClick={toggleMenu} className="ui large button">
            <i className="download icon" />
            Burger
          </button>
        </div>}
      </div>
    );
  } // end render
} // end class

MenuFactory.propTypes = {
  hideButton: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  items: PropTypes.array,
  title: PropTypes.string,
  toggleMenu: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  heading: PropTypes.string,
};

MenuFactory.defaultProps = {
  hideButton: false,
  items: [],
  searchField: null,
  title: 'Options',
};

export default MenuFactory;
