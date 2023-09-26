"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
dotenv_1.default.config();
(0, db_1.db)();
const port = process.env.PORT || 5000;
app_1.default.listen(port, () => console.log(`Server is up and running on port ${port}`));
