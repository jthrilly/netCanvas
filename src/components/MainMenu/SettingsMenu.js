import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isElectron } from '../../utils/Environment';
import { Icon, Button } from '../../ui/components';
import Scroller from '../Scroller';
import { Toggle, Text } from '../../ui/components/Fields';
import MenuPanel from './MenuPanel';

class SettingsMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.electronWindow = this.getElectronWindow();

    this.state = {
      fullScreenApp: this.electronWindow && this.electronWindow.isFullScreen(),
    };
  }

  getElectronWindow = () => {
    if (isElectron()) {
      const electron = window.require('electron');
      return electron.remote.getCurrentWindow();
    }
    return false;
  }

  handleToggleUseFullScreenApp = () => {
    if (this.electronWindow) {
      if (this.electronWindow.isFullScreen()) {
        this.electronWindow.setFullScreen(false);
        this.setState({
          fullScreenApp: false,
        });
      } else {
        this.electronWindow.setFullScreen(true);
        this.setState({
          fullScreenApp: true,
        });
      }
    }
  }

  render() {
    const {
      active,
      onClickInactive,
      handleAddMockNodes,
      handleResetAppData,
      importProtocolFromURI,
      toggleUseFullScreenForms,
      useFullScreenForms,
      shouldShowMocksItem,
      toggleUseDynamicScaling,
      useDynamicScaling,
      setDeviceDescription,
      deviceDescription,
      setInterfaceScale,
      interfaceScale,
      onCloseMenu,
    } = this.props;

    return (
      <MenuPanel
        active={active}
        panel="settings"
        onClickInactive={onClickInactive}
        onCloseMenu={onCloseMenu}
      >
        <Icon name="settings" />
        <div className="main-menu-settings-menu">
          <div className="main-menu-settings-menu__header">
            <h1>Settings</h1>
          </div>
          <Scroller>
            <div className="main-menu-settings-menu__form">
              <fieldset>
                <legend>Device Options</legend>
                <section>
                  <label htmlFor="deviceName">Device Name</label>
                  <Text
                    input={{
                      value: deviceDescription,
                      onChange: e => setDeviceDescription(e.target.value),
                    }}
                    name="deviceName"
                    label="Device name"
                    fieldLabel=" "
                  />
                  <p>The device name determines how your device appears to Server.</p>
                </section>
                <section>
                  <Button
                    color="neon-coral"
                    onClick={handleResetAppData}
                  >
                    Reset Network Canvas data
                  </Button>
                  <p>
                    Click the button above to reset all Network Canvas data. This will erase any
                    in-progress interviews, and all application settings.
                  </p>
                </section>
              </fieldset>
              <fieldset>
                <legend>Developer Options</legend>
                {
                  shouldShowMocksItem &&
                  <section>
                    <Button
                      color="mustard"
                      onClick={handleAddMockNodes}
                    >
                      Add mock nodes
                    </Button>
                    <p>
                      During an active interview session, clicking this button will create
                      mock nodes for testing purposes.
                    </p>
                  </section>
                }
                <section>
                  <Button
                    color="mustard"
                    onClick={() => importProtocolFromURI('https://github.com/codaco/development-protocol/releases/download/20190508100622-1e156f7/development-protocol.netcanvas')}
                  >
                    Import development protocol
                  </Button>
                  <p>
                    Clicking this button will import the latest development protocol for this
                    version of Network Canvas.
                  </p>
                </section>
              </fieldset>
              <fieldset>
                <legend>Display Settings</legend>
                <section>
                  <label htmlFor="scaleFactor">Interface Scale</label>
                  <input
                    type="range"
                    name="scaleFactor"
                    min="80"
                    max="120"
                    value={interfaceScale}
                    onChange={(e) => { setInterfaceScale(parseInt(e.target.value, 10)); }}
                    step="5"
                  />
                  <p>
                    This setting allows you to control the size of the Network Canvas user
                    interface. Increasing the interface size may limit the amount of information
                    visible on each screen.
                  </p>
                </section>
                <section>
                  <Toggle
                    input={{
                      checked: true,
                      value: useDynamicScaling,
                      onChange: toggleUseDynamicScaling,
                    }}
                    label="Use dynamic scaling?"
                    fieldLabel=" "
                  />
                  <p>
                    Dynamic scaling lets Network Canvas resize the user interface proportionally to
                    the size of the window. Turning it off will use a fixed size.
                  </p>
                </section>
                {isElectron() && <section>
                  <Toggle
                    input={{
                      checked: true,
                      value: this.state.fullScreenApp,
                      onChange: this.handleToggleUseFullScreenApp,
                    }}
                    label="Run in full screen?"
                    fieldLabel=" "
                  />
                  <p>
                    Network Canvas is designed to run in full screen mode for an
                    immersive experience. You may disable or enable this mode here.
                  </p>
                  <p>
                    <em><strong>Windows users:</strong> when in full screen mode you
                    can access the native app menu by passing the <code>alt</code> key.</em>
                  </p>
                </section>}
                <section>
                  <Toggle
                    input={{
                      checked: true,
                      value: useFullScreenForms,
                      onChange: toggleUseFullScreenForms,
                    }}
                    label="Use full screen node form?"
                    fieldLabel=" "
                  />
                  <p>
                    The full screen node form is optimized for smaller devices, or devices with
                    no physical keyboard.
                  </p>
                </section>
              </fieldset>
            </div>
          </Scroller>
        </div>
      </MenuPanel>
    );
  }
}

SettingsMenu.propTypes = {
  active: PropTypes.bool,
  onClickInactive: PropTypes.func,
  handleResetAppData: PropTypes.func.isRequired,
  importProtocolFromURI: PropTypes.func.isRequired,
  handleAddMockNodes: PropTypes.func.isRequired,
  shouldShowMocksItem: PropTypes.bool,
  toggleUseFullScreenForms: PropTypes.func.isRequired,
  useFullScreenForms: PropTypes.bool.isRequired,
  toggleUseDynamicScaling: PropTypes.func.isRequired,
  useDynamicScaling: PropTypes.bool.isRequired,
  setDeviceDescription: PropTypes.func.isRequired,
  deviceDescription: PropTypes.string.isRequired,
  setInterfaceScale: PropTypes.func.isRequired,
  interfaceScale: PropTypes.number.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
};

SettingsMenu.defaultProps = {
  active: false,
  onClickInactive: () => {},
  shouldShowMocksItem: false,
};

export default SettingsMenu;
