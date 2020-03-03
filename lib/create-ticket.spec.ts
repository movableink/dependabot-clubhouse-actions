import * as core from '@actions/core';
import nock from 'nock';
import createTicket from './create-ticket';
import SUCCESS_PAYLOAD from '../fixtures/create-ticket/success.json';
import SCHEMA_MISMATCH_PAYLOAD from '../fixtures/create-ticket/schema-mismatch.json';

jest.mock('@actions/github');

beforeEach(() => {
  nock.disableNetConnect();
});

test('it creates a ClubHouse ticket', async () => {
  const requestLog = jest.fn();
  nock('https://api.clubhouse.io')
    .log(requestLog)
    .post('/api/v3/stories?token=undefined')
    .reply(200, SUCCESS_PAYLOAD);

  await createTicket(
    {
      title: 'Testing',
      html_url: 'https://github.com/foo/bar',
      number: 123
    },
    {
      owner: {
        login: 'foo'
      },
      name: 'bar'
    }
  );

  expect(requestLog).toBeCalled();
});

test('it handles a ClubHouse error', async () => {
  nock('https://api.clubhouse.io')
    .post('/api/v3/stories?token=undefined')
    .reply(400, SCHEMA_MISMATCH_PAYLOAD);

  await createTicket(
    {
      title: 'Testing',
      html_url: 'https://github.com/foo/bar',
      number: 123
    },
    {
      owner: {
        login: 'foo'
      },
      name: 'bar'
    }
  );

  expect(core.error).toBeCalledWith('Bad Request');
});

test('it does not create a ticket if one is already attached', async () => {
  const requestLog = jest.fn();
  nock('https://api.clubhouse.io')
    .log(requestLog)
    .post('/api/v3/stories?token=undefined')
    .reply(200, SUCCESS_PAYLOAD);

  await createTicket(
    {
      title: 'Testing',
      html_url: 'https://github.com/foo/bar',
      number: 123,
      body: '[ch1234]'
    },
    {
      owner: {
        login: 'foo'
      },
      name: 'bar'
    }
  );

  expect(requestLog).toBeCalledTimes(0);
});
