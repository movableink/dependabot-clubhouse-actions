'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

const createTicket = require('./lib/create-ticket');

const { payload } = github.context;

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

  createTicket(payload);
}
