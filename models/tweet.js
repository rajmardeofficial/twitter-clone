const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  message: { type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  media: {
      type: String,
      url: String,
  },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdTimestamp: { type: Date, default: new Date() },
    },
  ],
});

// create a model (collection) named Tweet
//Note:
//- model name: User => collection name: tweets

module.exports = mongoose.model("Tweet", TweetSchema);
