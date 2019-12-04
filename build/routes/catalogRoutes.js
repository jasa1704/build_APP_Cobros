"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogService_1 = require("../services/catalogService");
const auth_1 = require("../middleware/auth");
class ClientRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/payments', auth_1.isAuth, catalogService_1.catalogService.list); //isAuth
        this.router.get('/entryType/:id', auth_1.isAuth, catalogService_1.catalogService.listPaymentype);
        this.router.post('/payments/add', auth_1.isAuth, catalogService_1.catalogService.registerPaymenType);
    }
}
const clienttRoutes = new ClientRoutes();
exports.default = clienttRoutes.router;
