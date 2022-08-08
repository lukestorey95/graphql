const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, default: null },
  email: { type: String, unique: true },
  password: String,
  token: String,
});

module.exports = model("User", userSchema);
