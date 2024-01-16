const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/DBConnection");
const User = require("./User");
const Discussion = require("./Discussion");

const Comment = sequelize.define(
  "Comment",
  {
    content: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: true }
);

User.hasMany(Comment);
Discussion.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Discussion);
Comment.hasMany(Comment);

module.exports = Comment;
