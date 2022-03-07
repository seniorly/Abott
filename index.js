const git = require('./src/lib/git');
const github = require('@actions/github');
const core = require('@actions/core');
const utils = require('./src/utils/utils');

const run = async () => {
  utils.validateTrigger(github.context.eventName);

  const pullRequest = github.context.payload.pull_request;
  const action = github.context.action;
  const reviewEvent = github.context.eventName;
  const target = core.getInput('target');
  const asanaPAT = core.getInput('asana-pat');
  const githubToken = core.getInput('GITHUB_TOKEN');
  const asanaSecret = core.getInput('ASANA_SECRET');

  await git(asanaPAT, asanaSecret, reviewEvent, pullRequest, target, action);
}

try {
  run();
} catch(err) {
  console.log(err);
  if (err instanceof Error) {
    core.setFailed(err.message);
  } else {
    core.setFailed('Unknown error');
  }
}