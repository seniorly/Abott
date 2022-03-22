# Abott

Abott's purpose is to help users link Asana task with GitHub PR and move the task to particular section in a project based on whether a PR is opened or approved.

## Usage

```yaml

name: Asana link
on:
  pull_request:
    types: [opened, reopened]
  pull_request_review:
    types: [submitted]

jobs:
  asana:
    runs-on: ubuntu-latest
    name: Asana
    steps:
      - name: Link Asana task to PR
        uses: seniorly/Abott@v1
        with:
          ASANA_SECRET: ${{ secrets.ASANA_SECRET }}
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          asana-pat: ${{ secrets.ASANA_PAT }}
          target: '{"APPROVED": "Ready For QA", "OPEN": "Code Review", "CLOSED": "Ready For QA", "MERGED": "Approved"}'
```

## Inputs

### `asana-pat`

**Required** The personal access token of your asana account.

#### `ASANA_SECRET`

**Optional** The asana integration secret. Required if you want to link the Github PR as a field in Asana task. Else comment will be added. To generate an Asana secret follow the below steps:

  * Go to https://github.integrations.asana.plus/auth?domainId=ghactions
  * Authorize the Asana app and the GitHub app
  * Copy the generated secret. Do not share this secret with anyone!


#### `GITHUB_TOKEN`

**Required** The Github token. This is required to get access to the PR state.

### `target`

**Required** The target json which handles which section the task should be moved to when the PR state of approved or opened is achieved. 

`{"APPROVED": "Ready For QA", "OPEN": "Code Review", "CLOSED": "Ready For QA", "MERGED": "Approved"}` 
In this example: *APPROVED* and *OPENED* are the states of PR and *Ready for QA* and *Code Review* are the section names inside the project.

## Output

### `res`

Outputs the result of the operation done. Output is an array which will contain if the task has been moved to those sections or not.

## License Summary

This code is made available under the MIT license.

## Credits

* [Asana Github Action](https://github.com/Asana/create-app-attachment-github-action)
* Github Actions documentation