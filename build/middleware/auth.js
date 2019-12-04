"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpstatus_1 = require("../utils/httpstatus");
const service_1 = require("../utils/service");
function isAuth(request, res, next) {
    if (!request.headers.authorization) {
        res.status(httpstatus_1.HttpStatus.FORBIDDEN).json({ message: 'El usuario no tiene autorización' });
    }
    const authorization = request.headers.authorization;
    const token = authorization.replace('Bearer ', '');
    service_1.service.validateToken(token)
        .then(response => {
        request.body.payload = response;
        // request.params.payload = response;
        next();
    })
        .catch(response => {
        res.status(response.status).json({ message: response.message });
    });
}
exports.isAuth = isAuth;
