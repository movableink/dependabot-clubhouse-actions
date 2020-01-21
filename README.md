# dependabot-clubhouse-actions

Automatically create a ClubHouse ticket for every Dependabot PR.

## Configuration

You'll need two things to start using this GitHub Action

- The "Project ID" for the project you want to create the story in. You can grab this out of the URL for the project on ClubHouse
- A [ClubHouse API Token][clubhouse-token]

## Usage

First, configure a [GitHub Secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) that holds your [ClubHouse API Token][clubhouse-token].

Note that the following example makes use of a `GITHUB_TOKEN` secret. This is provided automatically by GitHub Actions. While you _do_ need to provide it to the action configuration, as in the following example, you _do not_ need to generate a key yourself and add it to your secrets. You can read more about this [here](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token).

Here's an example of a GitHub Action configuration that should work for this package:

```yaml
# .github/workflows/create-dependabot-ticket.yaml
name: Dependabot ClubHouse Actions

on:
  pull_request:
    types: [opened]

jobs:
  create_ticket:
    name: Create Ticket
    runs-on: ubuntu-latest
    steps:
      - uses: movableink/dependabot-clubhouse-actions
        with:
          project-id: 123456 # Project to create story in
        env:
            CLUBHOUSE_API_TOKEN: ${{ secrets.CLUBHOUSE_API_TOKEN }}
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

[clubhouse-token]: https://help.clubhouse.io/hc/en-us/articles/205701199-Clubhouse-API-Tokens
