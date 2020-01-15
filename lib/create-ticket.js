'use strict';

const core = require('@actions/core');
const github = require('@actions/github');
const Clubhouse = require('clubhouse-lib');

const client = Clubhouse.create(core.getInput('token', { required: true }));
const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

module.exports = async function createTicket({ pull_request: pullRequest, repository }) {
  const { title, html_url } = pullRequest;

  try {
    const result = await core.group('Creating ClubHouse Story', () =>
      client.createStory({
        name: title,
        description: `See details from Dependabot [here](${html_url}).`,
        project_id: core.getInput('project-id', { required: true }),
        story_type: 'chore',
        workflow_state_id: core.getInput('initial-state-id')
      })
    );

    await core.group('Updating Pull Request', () =>
      octokit.pulls.update({
        owner: repository.owner.login,
        repo: repository.name,
        pull_number: pullRequest.number,
        body: pullRequest.body + `\n\n:house: [ch${result.id}](${result.app_url})`
      })
    );
  } catch (e) {
    if (e.response) {
      core.debug(JSON.stringify(e.response, null, 2));
    }

    if (e.body) {
      core.debug(JSON.stringify(e.body, null, 2));
    }

    core.error(e.message);
  }
};
