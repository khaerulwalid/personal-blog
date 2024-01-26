'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.article, {foreignKey: "ArticleId"})
      Comment.belongsTo(models.Visitor, {foreignKey: "VisitorId"})
    }
  }
  Comment.init({
    body: DataTypes.TEXT,
    VisitorId: DataTypes.INTEGER,
    ArticleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};