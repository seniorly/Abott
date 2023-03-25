require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 46:
/***/ ((module) => {

const triggers = [
  'pull_request',
  'pull_request_review',
  'pull_request_review_comment',
];

module.exports = triggers;

/***/ }),

/***/ 612:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const asana = __nccwpck_require__(810);
const core = __nccwpck_require__(62);

const asanaBot = async (asanaPat, taskID, target, prState, prUrl, prTitle, prNumber, commentStatus, doNotMoveSections) => {
  const client = asana.Client.create({
    'defaultHeaders': {
      'asana-enable': 'new_user_task_lists',
    },
  }).useAccessToken(asanaPat);

  core.debug(`TaskID: ${taskID}`);
  try {
    const task = await client.tasks.findById(taskID);
    const projects = task.projects;
    target = JSON.parse(target);
    let out = [];
    let foundFlag = false;
    for (const proj of projects) {
      const sections = await client.sections.findByProject(proj.gid);
  
      doNotMoveSections = JSON.parse(doNotMoveSections);
      if (doNotMoveSections.length > 0) {
        for (const members of task.memberships) {
          if (members.project.gid === proj.gid) {
            for (const doNotSec of doNotMoveSections) {
              if (members.section.gid === doNotSec) {
                continue
              } 
            }
          }
        }
      }
  
      try {
        const targetSection = await sections.find((sec) => sec.name === target[prState]);
        if (targetSection) {
          foundFlag = true;
          await client.sections.addTask(targetSection.gid, { task: taskID });
          out.push(`Moved ${task.name} to ${targetSection.name} in ${proj.name}`);
        } else {
          out.push(`Unable to move ${task.name} to ${target[prState]} in ${proj.name} as section doesn't exist.`)
        }
      } catch(err) {
        core.debug(err);
        out.push(`Unable to move ${task.name} to ${target[prState]} in ${proj.name} as section doesn't exist.`)
      }
    }
  
    if (commentStatus) {
      let comment;
      if (prState === 'OPEN') {
        comment = {
          text: `🔓 PR opened\n--------\n${prTitle}\n------------\nView: ${prUrl}`
        };
      }
  
      await client.tasks.addComment(taskID, comment);
    }
  
    if (prState === 'CLOSED') {
      await client.tasks.addComment(taskID, {
        text: `🛑 Closed Pull Request #${prNumber}.\n View: ${prUrl}`,
      });
    } else if (prState === 'MERGED') {
      await client.tasks.addComment(taskID, {
        text: `🎉 Merged Pull Request #${prNumber}\n${prTitle}\nView: ${prUrl}`,
      });
    } else if (prState === 'CHANGES_REQUESTED') {
      await client.tasks.addComment(taskID, {
        text: `❌ Changes request for PR #${prNumber}\n-> View: ${prUrl}`,
      });
    } else if (prState === 'APPROVED') {
      await client.tasks.addComment(taskID, {
        text: `✅ PR Approved\n-------------------\n${prTitle}\n-------------------\nView: ${prUrl}`
      });
    }
  
    if (!foundFlag) {
      return [`No tasks found for the project and the sections mentioned`];
    } else {
      return out;
    }
  } catch (err) {
    core.debug(err);
  }
};

module.exports = asanaBot;

/***/ }),

/***/ 37:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(62);
const bot = __nccwpck_require__(612);
const axios = __nccwpck_require__(503);

const gitEvent = async (asanaPAT, asanaSecret, pr, target, prState, doNotMoveSections) => {
  const ASANA_TASK_LINK_REGEX = /https:\/\/app.asana.com\/(\d+)\/(?<project>\d+)\/(?<taskId>\d+).*/ig;
  if (pr != null) {
    core.info('Handling PR event...');
    const prUrl = pr.html_url;
    // const prIsMerged = pr.merged;
    const prBody = pr.body;
    const prNumber = pr.number;
    const prTitle = pr.title;

    let taskIDs = [];
    let rawParseUrlTask;
    let res;
    core.debug(prBody);
    while ((rawParseUrlTask = ASANA_TASK_LINK_REGEX.exec(prBody)) !== null) {
      taskIDs.push(rawParseUrlTask.groups.taskId);
    }

    core.info(taskIDs);

    for (const taskID of taskIDs) {
      let commentStatus = true;
      if (asanaSecret !== '') {
        // This happens only when the PR is created. Otherwise we don't need to link the issue
        if (prState === 'OPEN') {
          const axiosInstance = axios.create({
            baseURL: 'https://github.integrations.asana.plus/custom/v1',
            headers: {
              Authorization: `Bearer ${asanaSecret}`,
            }
          });

          const result = await axiosInstance.post('actions/widget', {
            allowedProjects: [],
            blockedProjects: [],
            pullRequestDescription: prBody,
            pullRequestName: prTitle,
            pullRequestNumber: prNumber,
            pullRequestURL: prUrl, 
          });
    
          core.info(result.status);
        }
        commentStatus = false;
      } else {
        commentStatus = true;
      }

      res = await bot(asanaPAT, taskID, target, prState, prUrl, prTitle, prNumber, commentStatus, doNotMoveSections);
      core.setOutput('res', res);
    }
  }
};

module.exports = gitEvent;


/***/ }),

/***/ 282:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const triggers = __nccwpck_require__(46);

module.exports = {
  validateTrigger: function(eventName) {
    if (!triggers.includes(eventName)) {
      throw new Error('Only pull_request, pull_request_review and pull_request_review_comment triggers are supported')
    }
  }
};

/***/ }),

/***/ 62:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 586:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 810:
/***/ ((module) => {

module.exports = eval("require")("asana");


/***/ }),

/***/ 503:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const github = __nccwpck_require__(586);
const core = __nccwpck_require__(62);

const utils = __nccwpck_require__(282);
const git = __nccwpck_require__(37);

const run = async () => {
  utils.validateTrigger(github.context.eventName);

  const action = github.context.payload.action;
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
  if (action === 'closed' && pullRequest.merged) {
    prState = 'MERGED';
  } else if (prReviews.length > 0) {
    prState = prReviews[prReviews.length - 1].state.toUpperCase();
  } else {
    prState = pullRequest.state.toUpperCase();
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

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map