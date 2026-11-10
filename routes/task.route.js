const { authenticate } = require("../middlewares/auth.middleware")

const express = require("express")
const router = express.Router()
const TaskController = require("../controllers/task.controller")
router.get("/protected", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "You have successfully accessed a protected route",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

router.post("/", authenticate, TaskController.createTask)
router.get("/", authenticate, TaskController.getTasks)
router.get("/:id", authenticate, TaskController.getTaskById)
router.put("/:id", authenticate, TaskController.updateTask)
router.delete("/:id", authenticate, TaskController.deleteTask)

module.exports = router;



