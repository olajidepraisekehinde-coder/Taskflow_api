const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "taskflow_api_db",
    process.env.DB_USERNAME || "root",
    process.env.DB_PASSWORD || null,
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
        define: {
            underscored: false,
            timestamps: true
        }
    }
);

const connectDB = async () => { // connectDB() handles the connection process.
    try {
        await sequelize.authenticate(); //checks whether the credentials and connection are valid.
        console.log("Database connected successfully");
        //     const [columns] = await sequelize.query("DESCRIBE students").catch(() => [[]     ]);
        //      if (columns && columns.length >       0) {
        //           console.log("Current MySQL 'students' table columns:", columns.map(c => c.Fie       ld));
        //        }
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
        throw error;
    }
};

module.exports = { sequelize, connectDB };