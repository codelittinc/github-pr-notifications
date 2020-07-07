import { Repositories, SlackRepository, Users } from '../services'
import { PullRequest } from '../models';

export default class PullRequestsController {
  static async index(req, res) {
    const devGroup = req.params.devGroup;

    const repositoryNames = (await Repositories.getRepositories()).map(p => p.name);

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

  static async get(req, res) {
    const { id, repositoryName } = req.params;
    const pr = await PullRequest.findBy({ghId: Number.parseInt(id), repositoryName})
    await pr.getMainSlackMessage();
    await pr.getReviews();
    await pr.getChanges();
    res.send({
      ...pr
    })
  }
}


const getPullRequestsJSON = async (prs) => {
  await Promise.all(prs.map(pr => pr.getReviews()));

  await Promise.all(prs.map(pr => pr.getChanges()));

  const finalPrs = [];
  for (let pr of prs) {
    const approvedReviews = pr.reviews.filter(r => r.state === 'approved')
    const reprovedReviews = pr.reviews.filter(r => r.state === 'changes_requested')

    const sortedChanges = pr.changes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    const latestChange = sortedChanges.length > 0 ? pr.changes[0] : undefined;

    const reviews = pr.reviews;

    const outdatedReviews = reviews.filter((r) => {
      return (r.updatedAt || r.createdAt) < (latestChange || {}).createdAt
    });

    const approvedByList = []


    for (let item of approvedReviews) {
      const user = await Users.find(item.username);
      approvedByList.push(user.slack)
    }

    const repprovedByList = [];
    for (let item of reprovedReviews) {
      const user = await Users.find(item.username);
      repprovedByList.push(user.slack)
    }

    const outdatedReviewsUsernames = [];
    for (let item of outdatedReviews) {
      const user = await Users.find(item.username);
      if (item.username !== pr.username) {
        outdatedReviewsUsernames.push(user.slack)
      }
    }

    const getListOrFirst = (list) => {
      if (list.length > 1) {
        return list;
      } else if (list.length === 1) {
        return list[0]
      }
    }

    finalPrs.push({
      title: pr.title,
      link: pr.link,
      ci_state: pr.ciState ? pr.ciState : 'unavailable',
      approved_by: getListOrFirst(approvedByList),
      reproved_by: getListOrFirst(repprovedByList),
      new_changes_after_last_review_of: getListOrFirst(outdatedReviewsUsernames)
    })
  }
  return finalPrs;
}