const { where } = require('sequelize');
const { User } = require('../models')
const { Task } = require("../models")

class TaskController {
    static async createTask(req, res) {
        try {
            const { title, description, status, dueDate } = req.body

            // validating if title exists
            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title is required"
                });
            }

            const tasks = await Task.create({
                userId: req.user.id,
                title: title.trim(),
                description,
                status,
                dueDate
            })
            return res.status(201).json({
                message: "Task created successfully",
                data: tasks,
                success: true
            })
        } catch (error) {
            console.error("Task creation error:", error.message);
            return res.status(500).json({
                message: "Internal server error",
                success: false
            })
        }
    }

    static async getTasks(req, res) {
        try {
            const id = req.user.id
            const tasks = await Task.findAll({ where: { userId: id } })

            return res.status(200).json({
                message: "Tasks retrieved successfully",
                success: true,
                data: tasks
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                success: false,
                error: error.message
            })
        }
    }

    static async getTaskById(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id

            const tasks = await Task.findOne({
                where:
                {
                    id,
                    userId
                }
            })
            if (!tasks) {
                return res.status(404).json({
                    message: "Task not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Task retrieved successfully",
                data: tasks
            });

        } catch (error) {
            console.error("Get task error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    static async updateTask(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const { title, description, status, dueDate } = req.body

            const tasks = await Task.findOne({ where: { id, userId } })

            if (!tasks || tasks.userId !== req.user.id) {
                return res.status(404).json({
                    message: "Tasks not found"
                })
            }

            await tasks.update({
                title,
                description,
                status,
                dueDate
            },
                {
                    where: { id, userId }
                })

            const updatedTask = await Task.findOne({
                where: { id, userId }
            });

            // Instead of 
            // const updateTasks = await Task.update({
            //     title,
            //     description,
            //     status,
            //     dueDate
            // },
            //     {
            //         where: { id, userId }
            //     })

            return res.status(200).json({
                message: "Task updated successfully",
                success: true,
                data: updatedTask
            })

        } catch (error) {
            console.error('update tasks error', error.message);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // checking task ownership
            const tasks = await Task.findOne({ where: { id, userId } }) // Excellent. This prevents users from deleting tasks belonging to other users.
            if (!tasks) {
                return res.status(404).json({
                    message: "Task not found",
                    success: false
                })
            }

            await tasks.destroy()
            return res.status(200).json({
                message: "Tasks deleted successfully"
            })
        } catch (error) {
            console.log("Delete tasks error", error.message)
            return res.status(500).json({
                message: "Internal server error",
                success: false
            })
        }
    }
}
module.exports = TaskController