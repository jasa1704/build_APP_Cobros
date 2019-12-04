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
//import config from '../config';
class ClientService {
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = queries_1.queries.createClientListQuery();
            const listClients = yield connectionDB_1.default.query(sqlQuery);
            if (listClients.length > 0) {
                try {
                    let listAllClients = new Array();
                    for (let index = 0; index < listClients.length; index++) {
                        listAllClients.push({
                            id: listClients[index].id,
                            email: listClients[index].email,
                            password: listClients[index].passwork,
                            fullname: listClients[index].nombre,
                            codigorol: listClients[index].codigorol,
                            mobileNumber: listClients[index].celular,
                            address: listClients[index].direccion,
                            identification: listClients[index].identificacion,
                            homeNumber: listClients[index].telefono,
                            status: listClients[index].status,
                            city: listClients[index].ciudad,
                            reference: {
                                id: listClients[index].refid,
                                fullname: listClients[index].refnombre,
                                identification: listClients[index].refidentificacion,
                                mobileNumber: listClients[index].refcelular,
                                address: listClients[index].refdireccion
                            },
                            numberOfCredits: listClients[index].prestamos
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllClients });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listClients });
        });
    }
    registerClient(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const person = new person_1.Person(body);
                var sqlReferenceQuery = queries_1.queries.createPersonQuery(person.reference, 0);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlReferenceQuery).then(function (result) {
                            var idPerson = result.insertId;
                            let sqlClienQuery = queries_1.queries.createPersonQuery(person, idPerson);
                            connection.query(sqlClienQuery).then(function (result) {
                                var idPersonParent = result.insertId;
                                connection.commit().then(function (err) {
                                    return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: idPersonParent } });
                                });
                            });
                        });
                    });
                });
            }
            else {
                serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.BAD_REQUEST, 'Petición invalida');
                return response.json(serviceResponse);
            }
        });
    }
    updateClient(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const person = new person_1.Person(body);
                var sqlQueryUpdatePerson = queries_1.queries.updatePersonQuery(person.reference);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlQueryUpdatePerson).then(function (result) {
                            let sqlQueryUpdateUser = queries_1.queries.updatePersonQuery(person);
                            connection.query(sqlQueryUpdateUser, function (error) {
                                if (error) {
                                    return connection.rollback().then(function () {
                                        if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El correo ingresado ya se encuentra registrado');
                                            return response.json(serviceResponse);
                                        }
                                        else {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                            console.log("error linea 123 ", error.errno);
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
            }
            else {
                return response.status(httpstatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Petición invalida' });
            }
        });
    }
    deleteClient(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            var referenceId = params.refId;
            let sqlQuery = queries_1.queries.deleteUserQuery(id);
            yield connectionDB_1.default.getConnection().then(function (connection) {
                connection.beginTransaction().then(function (err) {
                    connection.query(sqlQuery).then(function (result) {
                        let sqlQueryDelete = queries_1.queries.deleteUserQuery(referenceId);
                        connection.query(sqlQueryDelete, function (error) {
                            if (error) {
                                return connection.rollback().then(function () {
                                    let errorResponse;
                                    if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El usuario no se encuentra registrado');
                                    }
                                    else {
                                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                                    }
                                });
                            }
                            connection.commit().then(function (err) {
                                return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { message: 'Usuario Eliminado con éxito' } });
                            });
                        });
                    });
                });
            });
        });
    }
}
exports.clientService = new ClientService();
