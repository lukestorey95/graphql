const messageResolvers = require("./messages");

module.exports = {
  Query: {
    ...messageResolvers.Query,
  },
  Mutation: {
    ...messageResolvers.Mutation,
  },
};
