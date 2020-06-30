import { Slack, Users } from '@services'

export default async (prId, link, ghUsername) => {
  const jiraCode = link.match(/[a-zA-Z]+-\d+$/)[0];
  const user = await Users.find(ghUsername)
  Slack.getInstance().sendDirectEphemeral({
    username: user.slack,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:jira: On the PR *${prId}* I found the Jira card *${jiraCode}*, do you like to move it to *Ready for QA*?`
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Yes, please!"
            },
            "style": "primary",
            "value": "yes",
            "action_id": `jira-status-update-${jiraCode}`	
          },
//          {
//            "type": "button",
//            "text": {
//              "type": "plain_text",
//              "text": "No, thanks!"
//            },
//            "style": "danger",
//          }
        ]
      }
    ]
  })
} 