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
      });

      describe('when there are no differences between master and the latest release and is trying to create a release candidate', () => {
        it('does not create a new release', (done) => {
          sinon.stub(Github, 'listReleases').returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);
          sinon.stub(GithubCommits, 'getCommitMessagesText').returns(null)
          const gitStub = sinon.stub(Github, 'createRelease');

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }
          TagReleaseFlow.start(json, () => {
            expect(gitStub.notCalled).toBeTruthy()

            GithubCommits.getCommitMessagesText.restore()
            Github.listReleases.restore();
            Github.createRelease.restore();

            done()
          })
        });
      });

      describe('when there are no differences between master and the latest release and is trying to create a stable release', () => {
        it('does not create a new release', (done) => {
          sinon.stub(Github, 'listReleases').returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);

          sinon.stub(GithubCommits, 'getCommitMessagesText').returns(null)
          sinon.stub(Github, 'listBranchCommits').returns([{}, {}])
          const gitStub = sinon.stub(Github, 'createRelease');

          const json = {
            text: 'update prod',
            channel_name: 'test-gh-deploy'
          }
          TagReleaseFlow.start(json, () => {
            expect(gitStub.notCalled).toBeTruthy()

            GithubCommits.getCommitMessagesText.restore()
            Github.listReleases.restore();
            Github.createRelease.restore();

            done()
          })
        });
      });

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
          text: 'update X',
          channel_name: 'team-website-deploy'
        }

        expect(TagReleaseFlow.isFlow(json)).toBeTruthy()
      });
    });

    describe('with an invalid JSON', () => {
      it('which project does not deploy with tag', () => {
        const json = {
          text: 'update X',
          channel_name: 'test-gh-deploy'
        }

        expect(TagReleaseFlow.isFlow(json)).toBeFalsy()
      });

      it('which action is not update', () => {
        const json = {
          text: 'spotcheck X',
          channel_name: 'team-website-deploy'
        }

        expect(TagReleaseFlow.isFlow(json)).toBeFalsy()
      });
    });
  });
});