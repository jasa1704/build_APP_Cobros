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
const service_response_1 = require("../utils/service.response");
const entry_1 = require("../model/entry");
const util_1 = require("util");
//import config from '../config';
class EntryService {
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = queries_1.queries.getAllEntriesQuery();
            const listEntries = yield connectionDB_1.default.query(sqlQuery);
            if (listEntries.length > 0) {
                try {
                    let listAllEntries = new Array();
                    let sqlTotals = queries_1.queries.getCapitalQuery();
                    const total = yield connectionDB_1.default.query(sqlTotals);
                    console.log("SERVICIO DE ENTRADAS");
                    console.log(total);
                    for (let index = 0; index < listEntries.length; index++) {
                        listAllEntries.push({
                            id: listEntries[index].id,
                            amount: listEntries[index].amount,
                            sedeId: listEntries[index].sede,
                            cretionDate: listEntries[index].creationDate,
                            entryType: {
                                id: listEntries[index].tmId,
                                name: listEntries[index].tmName,
                                isEntryIn: listEntries[index].isEntryIn
                            }
                        });
                    }
                    let capital;
                    if (total.length >= 3) {
                        let available = 0;
                        let receivable = 0;
                        if (!util_1.isNull(total[0].entradas)) {
                            available = total[0].entradas;
                            if (!util_1.isNull(total[1].entradas)) {
                                available = available - total[1].entradas;
                            }
                        }
                        if (!util_1.isNull(total[2].entradas)) {
                            receivable = total[2].entradas;
                        }
                        capital = { available: available, receivable: receivable };
                    }
                    else {
                        capital = { available: 0, receivable: 0 };
                    }
                    console.log("FIN SERVICIO DE ENTRADAS");
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { entries: listAllEntries, capital: capital } });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { entries: listEntries, capital: { available: 0, receivable: 0 } } });
        });
    }
    registerEntry(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                console.log(body);
                const entry = new entry_1.Entry(body);
                console.log(entry);
                var sqlCreditQuery = queries_1.queries.createEntryQuery(entry);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlCreditQuery).then(function (result) {
                            var idEntry = result.insertId;
                            connection.commit().then(function (err) {
                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: idEntry } });
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
    updateEntry(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const entry = new entry_1.Entry(body);
                var sqlQueryUpdateEntry = queries_1.queries.updateEntryQuery(entry);
                console.log(body);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlQueryUpdateEntry).then(function (result) {
                            connection.commit().then(function (err) {
                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: entry.id } });
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
exports.entryService = new EntryService();
