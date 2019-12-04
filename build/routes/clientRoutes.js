"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientService_1 = require("../services/clientService");
const auth_1 = require("../middleware/auth");
class ClientRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', auth_1.isAuth, clientService_1.clientService.list); //isAuth
        this.router.post('/add', auth_1.isAuth, clientService_1.clientService.registerClient);
        this.router.put('/update', auth_1.isAuth, clientService_1.clientService.updateClient);
        this.router.delete('/delete/:id/:refId', auth_1.isAuth, clientService_1.clientService.deleteClient);
    }
}
const clientRoutes = new ClientRoutes();
exports.default = clientRoutes.router;
