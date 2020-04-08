import dotenv from 'dotenv'
dotenv.config()
import expect from 'expect';
import ReleaseFlow from '../../../../src/Flows/Repository/Github/ReleaseFlow/index.js';

describe('ReleaseFlow', () => {
  describe('.isFlow', () => {
    describe('with a valid JSON', () => {
      it('returns true', () => {
        const json = {
          text: 'update X',
          channel_name: 'test-gh-deploy'
        }

        expect(ReleaseFlow.isFlow(json)).toBeTruthy()
      });
    });

    describe('with an invalid JSON', () => {
      it('which project deploys with tag', () => {
        const json = {
          text: 'update X',
          channel_name: 'team-website-deploy'
        }

        expect(ReleaseFlow.isFlow(json)).toBeFalsy()
      });

      it('which action is not update', () => {
        const json = {
          text: 'spotcheck X',
          channel_name: 'team-website-deploy'
        }

        expect(ReleaseFlow.isFlow(json)).toBeFalsy()
      });
    });
  });
});