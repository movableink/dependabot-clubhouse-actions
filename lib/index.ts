import * as core from '@actions/core';
import * as github from '@actions/github';

import createTicket, { Status } from './create-ticket';

const { payload } = github.context;

async function main(): Promise<void> {
  // Ensure we are running on a `pull_request` event
  if (!payload.pull_request) {
    core.warning('Workflow run outside of a `pull_request` event');
    return;
  }

  if (payload.action === 'opened') {
    if (!payload.pull_request.user.login.includes('dependabot')) {
      core.debug('Not a dependabot PR');
      return;
    }

    const status = await createTicket(payload.pull_request, payload.repository);

    core.setOutput('created-ticket', `${status === Status.Created}`);

    if (status === Status.Error) {
      core.setFailed('Could not create ticket');
    }
  }
}

main();
