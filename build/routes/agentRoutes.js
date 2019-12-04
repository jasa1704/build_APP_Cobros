"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentService_1 = require("../services/agentService");
const auth_1 = require("../middleware/auth");
class AgentRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', auth_1.isAuth, agentService_1.agentService.list); //isAuth
        this.router.get('/history/:id', auth_1.isAuth, agentService_1.agentService.listHistory);
        this.router.post('/add', auth_1.isAuth, agentService_1.agentService.registerUser);
        this.router.put('/update', auth_1.isAuth, agentService_1.agentService.updateUser);
        this.router.delete('/delete/:id', auth_1.isAuth, agentService_1.agentService.deleteUser);
    }
}
const agentRoutes = new AgentRoutes();
exports.default = agentRoutes.router;
