const User = require("../../models/user");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
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

    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
          },
          privateKey,
          { expiresIn: "2h" }
        );

        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError("Email or password incorrect", "INCORRECT_LOGIN");
      }
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
