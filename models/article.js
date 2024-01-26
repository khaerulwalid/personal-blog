'use strict';
const {
  Model
} = require('sequelize');

const slug = require('slug')

module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static getNews(order) {
          let option = {
              include: [{
                  model: sequelize.models.Author
              },
              {
                  model: sequelize.models.Category,
              }]
          }

        if(order) {
            option.include[1].where = {
                name: `${order}`
            }
        }

        return article.findAll(option)
    }

    static associate(models) {
      // define association here
      article.belongsTo(models.Author, {foreignKey: "AuthorId"})
      article.belongsTo(models.Category, {foreignKey: "CategoryId"})
      article.hasMany(models.Comment, {foreignKey: "ArticleId"})
    }
  }
  article.init({
    slug: DataTypes.STRING,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title Required"
        },
        notNull: {
          msg: "Title Required"
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Article Required"
        },
        notNull: {
          msg: "Article Required"
        }
      }
    },
    AuthorId: DataTypes.INTEGER,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category Required"
        },
        notNull: {
          msg: "Category Required"
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image Url Required"
        },
        notNull: {
          msg: "Image Url Required"
        },
        checkLength(value) {
          if(value.length > 255) {
            throw new Error("Panjang Image URL tidak boleh lebih dari 255")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'article',
  });

  article.addHook('beforeCreate', (column) => {
      let data = slug(column.title, "_")
      column.slug = data
  });

  return article;
};