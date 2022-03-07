const triggers = require('../constants/trigger');

module.exports = {
  validateTrigger: function(eventName) {
    if (!triggers.includes(eventName)) {
      throw new Error('Only pull_request, pull_request_review and pull_request_review_comment triggers are supported')
    }
  }
};