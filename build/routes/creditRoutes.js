"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const creditService_1 = require("../services/creditService");
const auth_1 = require("../middleware/auth");
class ClientRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list', auth_1.isAuth, creditService_1.creditService.list);
        this.router.get('/agent/list', auth_1.isAuth, creditService_1.creditService.listbyAgent);
        this.router.get('/client/list/:id', auth_1.isAuth, creditService_1.creditService.listbyClient);
        this.router.get('/payment/:id', auth_1.isAuth, creditService_1.creditService.listPayment);
        this.router.post('/add', auth_1.isAuth, creditService_1.creditService.registerCredit);
        this.router.put('/update', auth_1.isAuth, creditService_1.creditService.updateCredit);
        this.router.put('/update/pay', auth_1.isAuth, creditService_1.creditService.updatePaymentCredit);
        this.router.delete('/delete/:id', auth_1.isAuth, creditService_1.creditService.deleteCredit);
        this.router.post('/summary', auth_1.isAuth, creditService_1.creditService.getSummary);
    }
}
const clienttRoutes = new ClientRoutes();
exports.default = clienttRoutes.router;
