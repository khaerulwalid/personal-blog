'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get indonesiaDate() {
      let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      let date = this.birthDay.toLocaleDateString('in-IN', options)

      return date
    }

    age() {
        let now = new Date()
        now = now.getFullYear()
        let birth = new Date(this.birthDay)
        birth = birth.getFullYear()

        return now-birth
    }

    static associate(models) {
      // define association here
      Author.hasOne(models.Profile, {foreignKey: "AuthorId"})
      Author.hasMany(models.article, {foreignKey: "AuthorId"})
      Author.belongsToMany(models.Visitor, {through: models.AuthorVisitor})
    }
  }
  Author.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthDay: DataTypes.DATE,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Author',
  });

  Author.addHook('beforeCreate', (field) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(field.password, salt);
    field.password = hash
  });
  return Author;
};