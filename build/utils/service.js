"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpstatus_1 = require("./httpstatus");
class Service {
    createToken(userId) {
        const payload = {
            sub: userId
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.TOKEN_DATA, {
            expiresIn: 60 * 60 * 8 //expira en 8 horas
        });
        return token;
    }
    validateToken(token) {
        const decoded = new Promise((resolve, reject) => {
            try {
                jsonwebtoken_1.default.verify(token, config_1.default.TOKEN_DATA, function (err, payload) {
                    if (err) {
                        reject({ status: httpstatus_1.HttpStatus.UNAUTHORIZED, message: 'El token ha expirado' });
                    }
                    resolve(payload);
                });
            }
            catch (err) {
                reject({ status: httpstatus_1.HttpStatus.UNAUTHORIZED, message: 'token invalido' });
            }
        });
        return decoded;
    }
}
exports.service = new Service();
