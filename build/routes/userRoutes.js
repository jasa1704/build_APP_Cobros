"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userService_1 = require("../services/userService");
const auth_1 = require("../middleware/auth");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/restore', userService_1.userService.restorePassWord);
        this.router.post('/updatePassword', auth_1.isAuth, userService_1.userService.updateUserPassword);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
