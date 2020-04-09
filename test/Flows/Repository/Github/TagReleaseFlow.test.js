import dotenv from 'dotenv'
dotenv.config()
import expect from 'expect';
import TagReleaseFlow from '../../../../src/Flows/Repository/Github/TagReleaseFlow/index.js';
import sinon from 'sinon';
import Github from '../../../../src/services/Github.js'
import GithubCommits from '../../../../src/services/GithubCommits.js'
import Slack from '../../../../src/services/Slack.js'

describe('TagReleaseFlow', () => {
  describe('.start', () => {
    let sendMessageStub;
    let slackGetInstaceStub;
    let listReleasesStub;
    let getCommitMessagesTextStub;
    let createReleaseStub;
    let listBranchCommitsStub;

    beforeEach(function () {
      sendMessageStub = sinon.stub();
      slackGetInstaceStub = sinon.stub(Slack, 'getInstance').returns({
        sendMessage: sendMessageStub
      });

      listReleasesStub = sinon.stub(Github, 'listReleases')
      getCommitMessagesTextStub = sinon.stub(GithubCommits, 'getCommitMessagesText')
      createReleaseStub = sinon.stub(Github, 'createRelease');
      listBranchCommitsStub = sinon.stub(Github, 'listBranchCommits');
    });

    afterEach(function () {
      Slack.getInstance.restore();
      Github.listReleases.restore();
      Github.createRelease.restore();
      Github.listBranchCommits.restore()
      GithubCommits.getCommitMessagesText.restore();
    });

    describe('with a valid JSON', () => {
      describe('when it is the first release', () => {
        it('creates a new pre-release', (done) => {
          listReleasesStub.returns([]);
          getCommitMessagesTextStub.returns('nice commit message')

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(createReleaseStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.0-rc1',
                branch: 'master',
                name: 'Version v0.0.0-rc1',
                body: 'Available in this release: \n - EVERYTHING up to now',
                prerelease: true
              }
            )).toBeTruthy()

            done()
          })
        });
      });

      describe('when there are no differences between master and the latest release and is trying to create a release candidate', () => {
        it('does not create a new release', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);
          getCommitMessagesTextStub.returns(null)

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(createReleaseStub.notCalled).toBeTruthy()

            done()
          })
        });

        it('notifies the user that it does not have new changes', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);

          getCommitMessagesTextStub.returns(null)

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          };

          TagReleaseFlow.start(json, () => {
            expect(sendMessageStub.calledWithExactly({
              message: "The server already has the latest updates",
              channel: 'test-gh-deploy'
            })).toBeTruthy()

            done()
          })
        });
      });

      describe('when there are no differences between master and the latest release and is trying to create a stable release', () => {
        it('does not create a new release', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);

          getCommitMessagesTextStub.returns(null)
          listBranchCommitsStub.returns([{}, {}])

          const json = {
            text: 'update prod',
            channel_name: 'test-gh-deploy'
          }
          TagReleaseFlow.start(json, () => {
            expect(createReleaseStub.notCalled).toBeTruthy()

            done()
          })
        });

        it('notifies the user that it does not have new changes', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);

          getCommitMessagesTextStub.returns(null)
          listBranchCommitsStub.returns([{}, {}])

          const json = {
            text: 'update prod',
            channel_name: 'test-gh-deploy'
          };

          TagReleaseFlow.start(json, () => {
            expect(sendMessageStub.calledWith({
              message: "The server already has the latest updates",
              channel: 'test-gh-deploy'
            })).toBeTruthy()

            done()
          })
        });
      });

      describe('when it already has a release candidate', () => {
        it('creates a new pre-release', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.0-rc1'
            }
          ]);
          getCommitMessagesTextStub.returns('nice commit message')

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(createReleaseStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.0-rc2',
                branch: 'master',
                name: 'Version v0.0.0-rc2',
                body: 'Available in this release: \nnice commit message',
                prerelease: true
              }
            )).toBeTruthy()

            done()
          })
        });
      })

      describe('when it already has a release', () => {
        it('creates a new pre-release', (done) => {
          listReleasesStub.returns([
            {
              tag_name: 'v0.0.1'
            }
          ]);
          getCommitMessagesTextStub.returns('nice commit message')

          const json = {
            text: 'update qa',
            channel_name: 'test-gh-deploy'
          }

          TagReleaseFlow.start(json, () => {
            expect(createReleaseStub.calledOnceWithExactly(
              {
                owner: 'codelittinc',
                repo: 'gh-hooks-repo-test',
                tagName: 'v0.0.2-rc0',
                branch: 'master',
                name: 'Version v0.0.2-rc0',
                body: 'Available in this release: \nnice commit message',
                prerelease: true
              }
            )).toBeTruthy()

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