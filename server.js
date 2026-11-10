const express = require('express')
const app = express()
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const { connectDB } = require("./config/database");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route")
const taskRouter = require("./routes/task.route")


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)

// Handle invalid JSON in request body
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format in request body. Please check for missing commas or quotes."
        });
    }
    next(err);
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();