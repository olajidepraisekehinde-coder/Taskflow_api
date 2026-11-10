'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
                Task.belongsTo(models.User, {
                    foreignKey: "userId",
                    as: "user"
                })
        }
    }

    Task.init({
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM("pending", "in_progress", "completed"),
            allowNull: false,
            defaultValue: "pending"
        },

        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
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
        }

    }, {
        sequelize,
        modelName: 'Task',
        tableName: "tasks"
    });
    return Task;
};