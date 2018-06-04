/* eslint-env jest */

import electron from 'electron';
import environments from '../../environments';
import { getEnvironment } from '../../Environment';
import downloadProtocol from '../downloadProtocol';

jest.mock('electron');
jest.mock('request-promise-native');
jest.mock('../../filesystem');

describe('downloadProtocol', () => {
  describe('Electron', () => {
    beforeAll(() => {
      getEnvironment.mockReturnValue(environments.ELECTRON);
    });

    it('returns a correct local path', () => {
      return expect(downloadProtocol('https://networkcanvas.com//foo bar.protocol')).resolves
        .toEqual(`${electron.app.getPath()}/foo bar.protocol`);
    });
  });
});
