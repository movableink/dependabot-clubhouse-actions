import * as core from '@actions/core';
import * as github from '@actions/github';
import Clubhouse from 'clubhouse-lib';

import { WebhookPayload, PayloadRepository } from '@actions/github/lib/interfaces';

const client = Clubhouse.create(process.env.CLUBHOUSE_API_TOKEN);
const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

const ticketRegex = /\[ch\d+\]/;

export enum Status {
  Created,
  NotCreated,
  Error
}

export default async function createTicket(
  pullRequest: WebhookPayload['pull_request'],
  repository: PayloadRepository
): Promise<Status> {
  const { title, html_url, body } = pullRequest;

  if (body && ticketRegex.test(body)) {
    core.debug('Pull request body matches ticket regex already.');
    return Status.NotCreated;
  }

  try {
    const result = await core.group('Creating ClubHouse Story', () =>
      client.createStory({
        name: title,
        description: `See details from Dependabot [here](${html_url}).`,
        project_id: parseInt(core.getInput('project-id', { required: true }), 10),
        story_type: 'chore',
        workflow_state_id: parseInt(core.getInput('initial-state-id'), 10)
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

    return Status.Created;
  } catch (e) {
    if (e.response) {
      core.debug(JSON.stringify(e.response, null, 2));
    }

    if (e.body) {
      core.debug(JSON.stringify(e.body, null, 2));
    }

    core.error(e.message);

    return Status.Error;
  }
}
