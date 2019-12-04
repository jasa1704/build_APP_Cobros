"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectionDB_1 = __importDefault(require("../database/connectionDB"));
const queries_1 = require("../database/queries");
const httpstatus_1 = require("../utils/httpstatus");
const sqlCodes_1 = require("../database/sqlcodes");
const service_response_1 = require("../utils/service.response");
//import { User } from '../../model/login/user';
const mail_1 = require("../mail/mail");
const templates_1 = require("../mail/templates");
//import config from '../config';
class UserService {
    updateUserPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = request.body.payload;
            const body = request.body;
            if (body != null) {
                const bcrypt = require('bcryptjs');
                var password = body.password;
                let errorResponse;
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) { }
                    bcrypt.hash(password, salt, function (err, hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                errorResponse = new service_response_1.ServiceResponse(sqlCodes_1.SqlCode.ZERO, 'undefinied');
                                return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                            }
                            var sqlQuery = "";
                            sqlQuery = queries_1.queries.updatePassword(payload.sub, hash);
                            yield connectionDB_1.default.query(sqlQuery, (error, results, fields) => {
                                if (error) {
                                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                                }
                                else {
                                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { estado: true, message: 'La contraseña ha sido actualizada con éxito' } });
                                }
                            });
                        });
                    });
                });
            }
            else {
                return response.status(httpstatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Petición invalida' });
            }
        });
    }
    restorePassWord(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            if (body != null) {
                const bcrypt = require('bcryptjs');
                var email = body.email;
                let serviceResponse;
                const sqlQuery = queries_1.queries.getUserByEmail(email);
                const listUsers = yield connectionDB_1.default.query(sqlQuery);
                if (listUsers.length > 0) {
                    //el usuario existe
                    try {
                        let index = 0;
                        const user = {
                            id: listUsers[index].id,
                            name: listUsers[index].name,
                            lastName: ''
                        };
                        //crea una contraseña aleatoria
                        var password = yield UserService.makeString(8);
                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) {
                                return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ocurrio un error contacte al administrador 1' });
                            }
                            bcrypt.hash(password, salt, function (err, hash) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (err) {
                                        serviceResponse = new service_response_1.ServiceResponse(sqlCodes_1.SqlCode.ZERO, 'undefinied');
                                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                    }
                                    var sqlQuery = queries_1.queries.updatePassword(user.id, hash);
                                    yield connectionDB_1.default.query(sqlQuery, (error, results, fields) => {
                                        if (error) {
                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ocurrio un error contacte al administrador 2' });
                                        }
                                        else {
                                            try {
                                                const userName = user.name + ' ' + user.lastName;
                                                const templateRestore = templates_1.template.getRestorePassword(userName, password);
                                                mail_1.sendMail(email, 'Restablecer Contraseña', templateRestore);
                                            }
                                            catch (e) {
                                                console.log(e);
                                            }
                                            serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.OK, 'La contraseña se ha restaurado con éxito');
                                            return response.json(serviceResponse);
                                        }
                                    });
                                });
                            });
                        });
                    }
                    catch (error) {
                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ocurrio un error contacte al administrador 3' });
                    }
                }
                else {
                    serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.NOT_FOUND, 'El usuario no se encuentra registrado');
                    return response.json(serviceResponse);
                }
            }
            else {
                return response.status(httpstatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Petición invalida' });
            }
        });
    }
    static makeString(parLenght) {
        let outString = '';
        let inOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < parLenght; i++) {
            outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        }
        return outString;
    }
}
exports.userService = new UserService();
