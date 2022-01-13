"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("./env");
const db = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
exports.sequelize = new sequelize_1.Sequelize(db, username, password, {
    dialect: "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST
});
exports.sequelize.authenticate();
//# sourceMappingURL=sequelize.js.map