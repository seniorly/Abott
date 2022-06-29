const github = require('@actions/github');
const core = require('@actions/core');

const utils = require('./src/utils/utils');
const git = require('./src/lib/git');

const run = async () => {
  utils.validateTrigger(github.context.eventName);

  const pullRequest = github.context.payload.pull_request;
  let prState = '';
  const target = core.getInput('target');
  const asanaPAT = core.getInput('asana_pat');
  const githubToken = core.getInput('github_token');
  const asanaSecret = core.getInput('asana_secret');
  const doNotMoveSections = core.getInput('donot_move');

  const client = github.getOctokit(githubToken);
  const reviews =  await client.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
  });

  const prReviews = reviews.data;
  if (prReviews.length === 0) {
    const statusPR = await client.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
    });

    const status = statusPR.data.state;
    const mergedStatus = statusPR.data.merged;
    core.debug(`Merge status is: ${mergedStatus}`);
    if (mergedStatus)
      prState = 'MERGED';
    else
      prState = status.toUpperCase();
  } else {
    const state = prReviews[prReviews.length - 1].state;
    prState = state;
  }

  core.info(prState);
  await git(asanaPAT, asanaSecret, pullRequest, target, prState, doNotMoveSections);
}

try {
  run();
} catch(err) {
  console.log(err);
  if (err instanceof Error) {
    core.setFailed(err.message);
  } else {
    core.error(err);
    core.setFailed('Unknown error');
  }
}