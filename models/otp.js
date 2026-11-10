'use strict';
const {
    Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    class Otp extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Otp.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user"
            })
        }

        // instance method to validate otp(compare plain with hashed code)
        async validateOtp(code) {
            return bcrypt.compare(code, this.codeHash);
        }

        async validateCode(code) {
            return bcrypt.compare(code, this.codeHash);
        }
    }
    Otp.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        codeHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        purpose: {
            type: DataTypes.ENUM("email_verification", "password_reset"),
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Otp',
        tableName: "otps",
        hooks: {
            beforeCreate: async (otp) => {
                if (otp.codeHash) {
                    const salt = await bcrypt.genSalt(12)
                    otp.codeHash = await bcrypt.hash(otp.codeHash, salt)
                }
            },
            beforeUpdate: async (otp) => {
                if (otp.changed('codeHash')) {
                    const salt = await bcrypt.genSalt(12)
                    otp.codeHash = await bcrypt.hash(otp.codeHash, salt)
                }
            }
        }
    });
    return Otp;
};