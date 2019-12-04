"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const credentialsDB_1 = __importDefault(require("./credentialsDB"));
const pool = promise_mysql_1.default.createPool(credentialsDB_1.default.database);
pool.getConnection()
    .then(connection => {
    pool.releaseConnection(connection);
});
exports.default = pool;
