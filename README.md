# dependabot-clubhouse-actions

Automatically create a ClubHouse ticket for every Dependabot PR.

## Usage

First, configure a [GitHub Secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets) that holds your [ClubHouse API Token](https://help.clubhouse.io/hc/en-us/articles/205701199-Clubhouse-API-Tokens).

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
          token: ${{ secrets.CLUBHOUSE_API_TOKEN }} # Use whatever you configured previously
```
