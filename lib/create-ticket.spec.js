const core = require("@actions/core");
const nock = require("nock");
const createTicket = require("./create-ticket");
const SUCCESS_PAYLOAD = require("../fixtures/create-ticket/success.json");
const SCHEMA_MISMATCH_PAYLOAD = require("../fixtures/create-ticket/schema-mismatch.json");

beforeEach(() => {
  nock.disableNetConnect();
});

test("it creates a ClubHouse ticket", async () => {
  const requestLog = jest.fn();
  nock("https://api.clubhouse.io")
    .log(requestLog)
    .post("/api/v3/stories?token=token")
    .reply(200, SUCCESS_PAYLOAD);

  nock("https://api.github.com")
    .patch("/repos/foo/bar/pulls/123")
    .reply(200, {});

  await createTicket({
    pull_request: {
      name: "Testing",
      url: "https://github.com/foo/bar",
      number: "123"
    },
    repository: {
      owner: {
        login: "foo"
      },
      name: "bar"
    }
  });

  expect(requestLog).toBeCalled();
});

test("it handles a ClubHouse error", async () => {
  nock("https://api.clubhouse.io")
    .post("/api/v3/stories?token=token")
    .reply(400, SCHEMA_MISMATCH_PAYLOAD);

  await createTicket({
    pull_request: {
      name: "Testing",
      url: "https://github.com/foo/bar",
      number: "123"
    },
    repository: {
      owner: {
        login: "foo"
      },
      name: "bar"
    }
  });

  expect(core.error).toBeCalledWith("Bad Request");
});
