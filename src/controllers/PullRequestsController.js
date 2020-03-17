import { SlackRepository } from '../services'
import { PullRequest } from '../models';

export default class PullRequestsController {
  static async index(req, res) {
    const devGroup = req.params.devGroup;

    const repositoryNames = Object.keys(SlackRepository.data);

    let repositoriesQuery;

    if (devGroup) {
      const filteredRepositories = repositoryNames.filter(k => SlackRepository.data[k].devGroup === `@${devGroup}`)
      repositoriesQuery = { $in: filteredRepositories };
    } else {
      repositoriesQuery = { $ne: 'gh-hooks-repo-test' };
    }

    const prs = await PullRequest.list({ state: 'open', repositoryName: repositoriesQuery })

    const data = await getPullRequestsJSON(prs);

    res.send({
      status: 200,
      length: data.length,
      data,
    })
  }
}

const getPullRequestsJSON = async (prs) => {
  await Promise.all(prs.map(pr => pr.getReviews()));

  await Promise.all(prs.map(pr => pr.getChanges()));

  return prs.map(pr => {
    const approvedReviews = pr.reviews.filter(r => r.state === 'approved')
    const reprovedReviews = pr.reviews.filter(r => r.state === 'changes_requested')

    const sortedChanges = pr.changes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    const latestChange = sortedChanges.length > 0 ? pr.changes[0] : undefined;

    const reviews = pr.reviews;

    const outdatedReviews = reviews.filter((r) => {
      return (r.updatedAt || r.createdAt) < (latestChange || {}).createdAt
    });

    const outdatedReviewsUsernames = outdatedReviews.map(a => a.username);

    const approvedByList = approvedReviews.map(r => SlackRepository.getSlackUser(r.username));
    const repprovedByList = reprovedReviews.map(r => SlackRepository.getSlackUser(r.username));

    const getListOrFirst = (list) => {
      if (list.length > 1) {
        return list;
      } else if (list.length === 1) {
        return list[0]
      }
    }

    return {
      title: pr.title,
      link: pr.link,
      ci_state: pr.ciState ? pr.ciState : 'unavailable',
      approved_by: getListOrFirst(approvedByList),
      reproved_by: getListOrFirst(repprovedByList),
      new_changes_after_last_review_of: getListOrFirst(outdatedReviewsUsernames)
    }
  })
}