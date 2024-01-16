const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/DBConnection");
const User = require("./User");

const Discussion = sequelize.define(
  "Discussion",
  {
    topic: { type: DataTypes.STRING, allowNull: false },
    content: {
      type: DataTypes.STRING,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { freezeTableName: true, timestamps: true }
);

// define one to many relationship
User.hasMany(Discussion);
Discussion.belongsTo(User);

module.exports = Discussion;
