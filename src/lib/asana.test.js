const bot = require('./asana');
const chai = require('chai');
const expect = chai.expect;

describe('Asana', () => {
  it('should work', async () => {
    console.log(process.env.ASANA_SECRET);
    const res = await bot(process.env.ASANA_SECRET, '1201867739381581', '{"approved": "Ready For QA", "opened": "Code Review"}', 'merged');
    expect(res.length).greaterThanOrEqual(1);
  });

  it('shouldnt work', async () => {
    const res = await bot(process.env.ASANA_SECRET, '1201883205174596', '{"approved": "Ready For QA", "opened": "Code Review"}', 'merged');
    expect(res[0]).equal('No tasks found for the project and the sections mentioned');
  });
});
