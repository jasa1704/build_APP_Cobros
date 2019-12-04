"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexService_1 = require("../services/indexService");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', indexService_1.indexService.index);
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
