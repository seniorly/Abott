const core = require('@actions/core');
const bot = require('./asana');
const axios = require('axios');

const gitEvent = async (asanaPAT, asanaSecret, event, pr, target, action) => {
  const ASANA_TASK_LINK_REGEX = /https:\/\/app.asana.com\/(\d+)\/(?<project>\d+)\/(?<taskId>\d+).*?/ig;
  if (pr != null) {
    core.info('Handling PR event...');
    const prUrl = pr.html_url;
    const prIsMerged = pr.merged;
    const prBody = pr.body;
    const prNumber = pr.number;
    const prTitle = pr.title;

    if (asanaSecret !== '') {
      const axiosInstance = axios.create({
        baseURL: 'https://github.integrations.asana.plus/custom/v1',
        headers: {
          Authorization: `Bearer ${asanaSecret}`,        }
      });

      const result = await axiosInstance.post('actions/widget', {
        allowedProjects: [],
        blockedProjects: [],
        pullRequestDescription: prBody,
        pullRequestName: prTitle,
        pullRequestNumber: prNumber,
        pullRequestURL: prUrl, 
      });

      console.log(result.data);
      core.info(result.status);
    } else {
      const res = await bot(asanaPAT, target, )
    }
  }
};

module.exports = gitEvent;
