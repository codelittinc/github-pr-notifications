import dotenv from 'dotenv'
dotenv.config()
import expect from 'expect';
import TagReleaseFlow from '../../../../src/Flows/Repository/Github/TagReleaseFlow/index.js';
import sinon from 'sinon';
import Github from '../../../../src/services/Github.js'
import GithubCommits from '../../../../src/services/GithubCommits.js'


describe('TagReleaseFlow', () => {
  describe('.start', () => {
    describe('with a valid JSON', () => {
      describe('when it is the first release', () => {
        it('creates a new pre-release', (done) => {
          sinon.stub(Github, 'listReleases').returns([]);
          sinon.stub(GithubCommits, 'getCommitMessagesText').returns('nice commit message')
          const gitStub = sinon.stub(Github, 'createRelease');

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(gitStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.0-rc1',
                branch: 'develop',
                name: 'Version v0.0.0-rc1',
                body: 'Available in this release: \n - EVERYTHING up to now',
                prerelease: true
              }
            )).toBeTruthy()

            GithubCommits.getCommitMessagesText.restore()
            Github.listReleases.restore();
            Github.createRelease.restore();

            done()
          })
        });
      })

      describe('when it already has a release candidate', () => {
        it('creates a new pre-release', (done) => {
          sinon.stub(Github, 'listReleases').returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);
          sinon.stub(GithubCommits, 'getCommitMessagesText').returns('nice commit message')
          const gitStub = sinon.stub(Github, 'createRelease');

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(gitStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.0-rc2',
                branch: 'develop',
                name: 'Version v0.0.0-rc2',
                body: 'Available in this release: \nnice commit message',
                prerelease: true
              }
            )).toBeTruthy()

            GithubCommits.getCommitMessagesText.restore()
            Github.listReleases.restore();
            Github.createRelease.restore();

            done()
          })
        });
      })
      describe('when it already has a release', () => {
        it('creates a new pre-release', (done) => {
          sinon.stub(Github, 'listReleases').returns([
            {
              tag_name: 'v0.0.1'
            }
          ]);
          sinon.stub(GithubCommits, 'getCommitMessagesText').returns('nice commit message')
          const gitStub = sinon.stub(Github, 'createRelease');

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(gitStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.2-rc0',
                branch: 'develop',
                name: 'Version v0.0.2-rc0',
                body: 'Available in this release: \nnice commit message',
                prerelease: true
              }
            )).toBeTruthy()

            GithubCommits.getCommitMessagesText.restore()
            Github.listReleases.restore();
            Github.createRelease.restore();

            done()
          })
        });
      })
    })
  })

  describe('.isFlow', () => {
    describe('with a valid JSON', () => {
      it('returns true', () => {
        const json = {
          text: 'update X'
        }

        expect(TagReleaseFlow.isFlow(json)).toBeTruthy()
      });
    });

    describe('with an invalid JSON', () => {
      it('returns true', () => {
        const json = {
          text: 'spotcheck X'
        }

        expect(TagReleaseFlow.isFlow(json)).toBeFalsy()
      });
    });
  });
});
