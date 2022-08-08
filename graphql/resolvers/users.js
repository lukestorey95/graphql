const User = require("../../models/user");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  Mutation: {
    async loginUser(_, { loginInput: { username, email, password } }) {
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        throw new ApolloError(
          "User already exists with email " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      let encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
        },
        privateKey,
        { expiresIn: "2h" }
      );

      newUser.token = token;

      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
