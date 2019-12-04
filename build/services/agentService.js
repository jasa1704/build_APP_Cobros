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
const sqlcodes_1 = require("../database/sqlcodes");
const service_response_1 = require("../utils/service.response");
const person_1 = require("../model/person");
const user_1 = require("../model/user");
const mail_1 = require("../mail/mail");
const templates_1 = require("../mail/templates");
//import config from '../config';
class AgentService {
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = queries_1.queries.getAllAgentByZone();
            const listAgents = yield connectionDB_1.default.query(sqlQuery);
            if (listAgents.length > 0) {
                try {
                    let listAllAgents = new Array();
                    for (let index = 0; index < listAgents.length; index++) {
                        listAllAgents.push({
                            id: listAgents[index].id,
                            email: listAgents[index].usuario,
                            password: listAgents[index].passwork,
                            fullname: listAgents[index].nombre,
                            codigorol: listAgents[index].codigorol,
                            mobileNumber: listAgents[index].celular,
                            address: listAgents[index].direccion,
                            identification: listAgents[index].identificacion,
                            homeNumber: listAgents[index].telefono,
                            status: listAgents[index].status,
                            city: listAgents[index].ciudad,
                            numberOfCredits: listAgents[index].numPrestamos
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllAgents });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAgents });
        });
    }
    listHistory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            const sqlQuery = queries_1.queries.getAgentHistoryQuery(id);
            const listAgentsHistory = yield connectionDB_1.default.query(sqlQuery);
            if (listAgentsHistory.length > 0) {
                try {
                    let listAllHistories = new Array();
                    for (let index = 0; index < listAgentsHistory.length; index++) {
                        listAllHistories.push({
                            id: listAgentsHistory[index].id,
                            clientName: listAgentsHistory[index].clientName,
                            amount: listAgentsHistory[index].amount,
                            amountDate: listAgentsHistory[index].amountDate,
                            longuitude: listAgentsHistory[index].longuitude,
                            latitude: listAgentsHistory[index].latitude
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllHistories });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAgentsHistory });
        });
    }
    registerUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                //consutar el rol de usuario cliente CLIENT
                const sqlRoleAgentQuery = queries_1.queries.getRoleAgentQuery();
                const roles = yield connectionDB_1.default.query(sqlRoleAgentQuery);
                if (roles.length > 0) {
                    const roleId = roles[0].id;
                    const person = new person_1.Person(body);
                    // user.role = roleId;
                    const bcrypt = require('bcryptjs');
                    var password = person.identification;
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            console.log("error linea 69");
                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                        }
                        bcrypt.hash(password, salt, function (err, hash) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    console.log("error linea 75");
                                    serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                }
                                var sqlQuery = queries_1.queries.createPersonQuery(person, 0);
                                yield connectionDB_1.default.getConnection().then(function (connection) {
                                    connection.beginTransaction().then(function (err) {
                                        connection.query(sqlQuery).then(function (result) {
                                            var idPerson = result.insertId;
                                            let user = new user_1.User(0, person.email, hash, idPerson, roleId);
                                            console.log("user ", user);
                                            let sqlUserQuery = queries_1.queries.createUserQuery(user);
                                            connection.query(sqlUserQuery, function (error) {
                                                if (error) {
                                                    return connection.rollback().then(function () {
                                                        if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El usuario ya se encuentra registrado');
                                                            return response.json(serviceResponse);
                                                        }
                                                        else {
                                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                                            console.log("error linea 95");
                                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                                        }
                                                    });
                                                }
                                                try {
                                                    const templateRestore = templates_1.template.getRegisterAgent(person.email, person.identification, person.fullname);
                                                    mail_1.sendMail(person.email, 'Registro de usuario', templateRestore);
                                                }
                                                catch (e) {
                                                    console.log(e);
                                                }
                                                connection.commit().then(function (err) {
                                                    return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: idPerson } });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    console.log("error linea 118");
                    serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ha ocurrido un error, por favor contacte al administrador');
                    return response.json(serviceResponse);
                }
            }
            else {
                serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.BAD_REQUEST, 'Petición invalida');
                return response.json(serviceResponse);
            }
        });
    }
    updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const person = new person_1.Person(body);
                const bcrypt = require('bcryptjs');
                var password = person.identification;
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.log("error linea 69");
                        serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                    }
                    bcrypt.hash(password, salt, function (err, hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log("error linea 75");
                                serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                            }
                            var sqlQueryUpdatePerson = queries_1.queries.updatePersonQuery(person);
                            yield connectionDB_1.default.getConnection().then(function (connection) {
                                connection.beginTransaction().then(function (err) {
                                    connection.query(sqlQueryUpdatePerson).then(function (result) {
                                        let sqlQueryUpdateUser = queries_1.queries.updateUserQuery(person.id, person.email, hash);
                                        connection.query(sqlQueryUpdateUser, function (error) {
                                            if (error) {
                                                return connection.rollback().then(function () {
                                                    if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                                                        serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El correo ingresado ya se encuentra registrado');
                                                        return response.json(serviceResponse);
                                                    }
                                                    else {
                                                        serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                                        console.log("error linea 95 ", error.errno);
                                                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                                    }
                                                });
                                            }
                                            connection.commit().then(function (err) {
                                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: person.id } });
                                            });
                                        });
                                    });
                                });
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
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            let sqlQuery = queries_1.queries.deleteUserQuery(id);
            yield connectionDB_1.default.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    let errorResponse;
                    if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El usuario no se encuentra registrado');
                    }
                    else {
                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                    }
                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                }
                else {
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { message: 'Usuario Eliminado con éxito' } });
                }
            });
        });
    }
}
exports.agentService = new AgentService();
