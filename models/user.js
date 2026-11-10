'use strict';
const { Model } = require('sequelize');
const bcrypt = require("bcrypt")
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        
        static associate(models) {
            // define association here
            User.hasMany(models.Task, {
                foreignKey: "userId",
                as: "tasks"
            });

            User.hasMany(models.Otp, {
                foreignKey: "userId",
                as: "otps",
            });
        }

        //instance method to validate password(compare plain with hashed passdword)
        async validatePassword(password) {
            return bcrypt.compare(password, this.password)
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isValidPassword(value) {
                    if (!value || value.length < 8 ) {
                        throw new Error("Password must be 8 characters long")
                    }
                }
            }
        },

        gender: {
            type: DataTypes.ENUM("male", "female", "others"),
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM("active", "inactive", "suspended", "pending"),
            defaultValue: "pending",
            allowNull: false
        },

    }, {
        sequelize,
        modelName: 'User',
        tableName: "users",

        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(12)
                    user.password = await bcrypt.hash(user.password, salt)
                }
            },

            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(12)
                    user.password = await bcrypt.hash(user.password, salt)
                }
            }
        }
    });


    return User;
};