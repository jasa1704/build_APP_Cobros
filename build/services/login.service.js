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
const service_1 = require("../utils/service");
const service_response_1 = require("../utils/service.response");
const sqlcodes_1 = require("../database/sqlcodes");
class LoginService {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = request.body;
            let serviceResponse;
            if (body != null) {
                const email = body.email;
                const password = body.password;
                const sqlQuery = queries_1.queries.getUserByEmail(email);
                const listUsers = yield connectionDB_1.default.query(sqlQuery);
                if (listUsers.length > 0) {
                    try {
                        let index = 0;
                        //select  us.usu_id as id, us.usu_passwork as passwork, us.usu_nombre as usuario,
                        // per.per_nombre as nombre, per.per_identificacion as identificacion,
                        // per.per_direccion as direccion, per.per_celular as celular, per.per_telefono as telefono,
                        // per.per_ciudad as ciudad, rol.rol_codigo as codigorol "+
                        const user = {
                            id: listUsers[index].id,
                            email: listUsers[index].usuario,
                            password: listUsers[index].passwork,
                            fullname: listUsers[index].nombre,
                            codigorol: listUsers[index].codigorol,
                            mobileNumber: listUsers[index].celular,
                            address: listUsers[index].direccion
                        };
                        const bcrypt = require('bcryptjs');
                        const match = yield bcrypt.compare(password, user.password);
                        if (match) {
                            const token = service_1.service.createToken(user.id);
                            return response.json({ code: httpstatus_1.HttpStatus.OK, data: { token: token, role: user.codigorol, fullname: user.fullname, email: user.email, mobileNumber: user.mobileNumber, address: user.address } });
                        }
                        else {
                            serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.NOT_FOUND, 'El nombre de usuario o la contraseña son incorrectos');
                            return response.json(serviceResponse);
                        }
                    }
                    catch (error) {
                        serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Error desconocido contacte al administrador');
                        return response.json(serviceResponse);
                    }
                }
                else {
                    serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.NOT_FOUND, 'El usuario no se encuentra registrado');
                    return response.json(serviceResponse);
                }
            }
            else {
                serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.BAD_REQUEST, 'Error desconocido contacte al administrador');
                return response.json(serviceResponse);
            }
        });
    }
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
                                errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                            }
                            var sqlQuery = "";
                            sqlQuery = queries_1.queries.updatePassword(payload.sub, hash);
                            yield connectionDB_1.default.query(sqlQuery, (error, results, fields) => {
                                if (error) {
                                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                                }
                                else {
                                    return response.status(httpstatus_1.HttpStatus.OK).json({ message: 'La contraseña ha sido actualizada con éxito' });
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
}
exports.loginService = new LoginService();
