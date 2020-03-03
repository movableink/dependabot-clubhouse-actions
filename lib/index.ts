import * as core from '@actions/core';
import * as github from '@actions/github';

import createTicket from './create-ticket';

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

    createTicket(payload.pull_request, payload.repository);
  }
}

main();
