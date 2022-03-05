const asana = require('asana');

const asanaBot = async (asanaPat, comment, taskID) => {
  const client = asana.Client.create({
    defaultHeaders: { 'asana-enable': 'new-sections,string_ids' },
    logAsanaChangeWarnings: false
  }).useAccessToken(asanaPat);

  const task = await client.tasks.findById(taskID);
  const projects = await client.tasks.projects(task.id).then((project) => project);
  console.log(projects);
};

export default asanaBot;
