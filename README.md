# Abott

Abott's purpose is to help users link Asana task with GitHub PR and move the task to particular section in a project based on whether a PR is opened or approved.

## Inputs

### asana-pat

**Required** The personal access token of your asana account.

### ASANA_SECRET

**Optional** The asana integration secret. Required if you want to link the Github PR as a field in Asana task. Else comment will be added

### GITHUB_TOKEN

**Required** The Github token. This is required to get access to the PR state.

### target

**Required** The target json which handles which section the task should be moved to when the PR state of approved or opened is achieved.
