const Message = require("../../models/message");
const { ApolloError } = require("apollo-server-errors");

module.exports = {
  Mutation: {
    async createMessage(_, { messageInput: { text, username } }) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
        createdAt: new Date().toISOString(),
      });

      const res = await newMessage.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
  Query: {
    getMessageById: async (parent, { id }, context, info) => {
      const message = await Message.findById(id);

      if (!message) {
        throw new ApolloError(
          "Could not find message with ID",
          "MESSAGE_NOT_FOUND"
        );
      }

      return message;
    },
    getAllMessages: async (parent, args, context, info) => {
      const messages = await Message.find();

      return messages;
    },
  },
};
