"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_service_1 = require("../services/login.service");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('', login_service_1.loginService.login);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
