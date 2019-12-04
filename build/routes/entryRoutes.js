"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entryService_1 = require("../services/entryService");
const auth_1 = require("../middleware/auth");
class EntryRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', auth_1.isAuth, entryService_1.entryService.list);
        this.router.post('/add', auth_1.isAuth, entryService_1.entryService.registerEntry);
        this.router.put('/update', auth_1.isAuth, entryService_1.entryService.updateEntry);
    }
}
const entryRoutes = new EntryRoutes();
exports.default = entryRoutes.router;
