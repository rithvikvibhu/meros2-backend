'use strict';

module.exports = function(Campaign) {
Campaign.beforeRemote('create', function(context, user, next) {
  context.args.data.dateCreated = Date.now();
  context.args.data.customerId = context.req.accessToken.userId;
});
};
