"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
exports.default = {
    database: {
        host: config_1.default.HOST_DB,
        user: config_1.default.USER_DB,
        password: config_1.default.PASSWORK_DB,
        database: config_1.default.DATABASE_NAME,
        port: config_1.default.PORT_DB
    }
};
