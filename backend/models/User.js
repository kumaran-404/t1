const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/DBConnection");

const User = sequelize.define(
  "User",
  {
    isModerator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email : {
      type : DataTypes.STRING ,
      unique : true ,
      allowNull : false 
    }
  },
  { freezeTableName: true }
);

module.exports = User;
