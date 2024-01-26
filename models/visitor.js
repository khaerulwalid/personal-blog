'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  class Visitor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    age() {
      let now = new Date()
      now = now.getFullYear()
      let birth = new Date(this.birthDay)
      birth = birth.getFullYear()

      return now-birth
  }

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


    static associate(models) {
      // define association here
      Visitor.hasMany(models.Comment, {foreignKey: "VisitorId"})
      Visitor.belongsToMany(models.Author, {through: models.AuthorVisitor})
    }
  }
  Visitor.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthDay: DataTypes.DATE,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Visitor',
  });
  Visitor.addHook('beforeCreate', (field) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(field.password, salt);
    field.password = hash
  });

  return Visitor;
};