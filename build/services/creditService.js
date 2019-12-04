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
const credit_1 = require("../model/credit");
const payment_1 = require("../model/payment");
const entry_1 = require("../model/entry");
const util_1 = require("util");
//import config from '../config';
class CreditService {
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = queries_1.queries.getAllCreditQuery();
            const listCredits = yield connectionDB_1.default.query(sqlQuery);
            if (listCredits.length > 0) {
                try {
                    let listAllCredits = new Array();
                    for (let index = 0; index < listCredits.length; index++) {
                        listAllCredits.push({
                            id: listCredits[index].id,
                            startDate: listCredits[index].fechaInicio,
                            endDate: listCredits[index].fechaFin,
                            amount: listCredits[index].capital,
                            clientId: listCredits[index].clientId,
                            clientName: listCredits[index].cliente,
                            agentId: listCredits[index].cobradoId,
                            agentName: listCredits[index].cobrador,
                            stateId: listCredits[index].estadoId,
                            stateName: listCredits[index].estado,
                            cellphone: listCredits[index].cellphone,
                            pays: listCredits[index].pagosHechos,
                            paymentType: {
                                id: listCredits[index].cobroId,
                                numberOfCuotes: listCredits[index].cuotas,
                                rate: listCredits[index].interes,
                                name: listCredits[index].tipocobro,
                                dayToSum: listCredits[index].dias
                            }
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { credits: listAllCredits, paymentToday: 0 } });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { code: httpstatus_1.HttpStatus.OK, data: { credits: listCredits, paymentToday: 0 } } });
        });
    }
    listbyAgent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = request.body.payload;
            var id = payload.sub;
            const sqlQuery = queries_1.queries.getAllCreditByAgentQuery(id);
            const listCredits = yield connectionDB_1.default.query(sqlQuery);
            if (listCredits.length > 0) {
                try {
                    let listAllCredits = new Array();
                    let payment = 0;
                    for (let index = 0; index < listCredits.length; index++) {
                        listAllCredits.push({
                            id: listCredits[index].id,
                            startDate: listCredits[index].fechaInicio,
                            endDate: listCredits[index].fechaFin,
                            amount: listCredits[index].capital,
                            clientId: listCredits[index].clientId,
                            clientName: listCredits[index].cliente,
                            clientAddress: listCredits[index].addresss,
                            agentId: listCredits[index].cobradoId,
                            agentName: listCredits[index].cobrador,
                            stateId: listCredits[index].estadoId,
                            stateName: listCredits[index].estado,
                            cellphone: listCredits[index].cellphone,
                            pays: listCredits[index].pagosHechos,
                            paymentType: {
                                id: listCredits[index].cobroId,
                                numberOfCuotes: listCredits[index].cuotas,
                                rate: listCredits[index].interes,
                                name: listCredits[index].tipocobro,
                                dayToSum: listCredits[index].dias
                            }
                        });
                        if (!util_1.isNull(listCredits[index].sumPayments)) {
                            payment += listCredits[index].sumPayments;
                        }
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { credits: listAllCredits, paymentToday: payment } });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { credits: listCredits, paymentToday: 0 } });
        });
    }
    listbyClient(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            const sqlQuery = queries_1.queries.getAllCreditByClientQuery(id);
            const listCredits = yield connectionDB_1.default.query(sqlQuery);
            if (listCredits.length > 0) {
                try {
                    let listAllCredits = new Array();
                    for (let index = 0; index < listCredits.length; index++) {
                        listAllCredits.push({
                            amount: listCredits[index].capital,
                            state: listCredits[index].state,
                            delay: listCredits[index].delay,
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllCredits });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { credits: listCredits, paymentToday: 0 } });
        });
    }
    listPayment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            const sqlQuery = queries_1.queries.getAllPaymentByCredit(id);
            const listPayment = yield connectionDB_1.default.query(sqlQuery);
            if (listPayment.length > 0) {
                try {
                    let listAllPayment = new Array();
                    for (let index = 0; index < listPayment.length; index++) {
                        listAllPayment.push({
                            id: listPayment[index].id,
                            observation: listPayment[index].observation,
                            dateOfPay: listPayment[index].dateOfPay,
                            amount: listPayment[index].amount,
                            creditId: listPayment[index].creditId,
                            latitude: listPayment[index].latitude,
                            longitude: listPayment[index].longitude,
                            dateOfRegister: listPayment[index].dateOfRegister,
                            amountRegister: listPayment[index].amountRegister
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllPayment });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listPayment });
        });
    }
    registerCredit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const credit = new credit_1.Credit(body);
                var sqlCreditQuery = queries_1.queries.createCreditQuery(credit);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlCreditQuery).then(function (result) {
                            var idCredit = result.insertId;
                            let entry = new entry_1.Entry({
                                id: 0,
                                amount: credit.amount,
                                typeId: 11,
                                creditId: idCredit,
                                paymentId: 0
                            });
                            let sqlEntry = queries_1.queries.createEntryCreditQuery(entry);
                            connection.query(sqlEntry, function (error) {
                                if (error) {
                                    return connection.rollback().then(function () {
                                        serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                    });
                                }
                            });
                            var arrPayment = body.payments;
                            var payment;
                            for (let i = 0; i < arrPayment.length; i++) {
                                payment = new payment_1.Payment(arrPayment[i]);
                                let sqlPaymentQuery = queries_1.queries.createPaymentQuery(payment, idCredit);
                                connection.query(sqlPaymentQuery, function (error) {
                                    if (error) {
                                        return connection.rollback().then(function () {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                        });
                                    }
                                });
                            }
                            connection.commit().then(function (err) {
                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: idCredit } });
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
    updateCredit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const credit = new credit_1.Credit(body);
                var arrPayment = body.payments;
                var sqlQueryUpdateCredit = queries_1.queries.updateCreditQuery(credit);
                var payment;
                console.log(sqlQueryUpdateCredit);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        //se actualiza el credito
                        connection.query(sqlQueryUpdateCredit).then(function (result) {
                            let sqlEntry = queries_1.queries.updateEntryCreditQuery(credit.amount, credit.id);
                            connection.query(sqlEntry, function (error) {
                                if (error) {
                                    console.log(error);
                                    return connection.rollback().then(function () {
                                        serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                        return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                    });
                                }
                                //se eliminan los pagos correspondientes al credito
                                let deletePaymentQuery = queries_1.queries.deletePayments(credit.id);
                                connection.query(deletePaymentQuery, function (err) {
                                    //se registran los nuevos pagos
                                    if (err) {
                                        console.log(err);
                                        return connection.rollback().then(function () {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                        });
                                    }
                                    for (let i = 0; i < arrPayment.length; i++) {
                                        payment = new payment_1.Payment(arrPayment[i]);
                                        let sqlPaymentQuery = queries_1.queries.createPaymentQuery(payment, credit.id);
                                        connection.query(sqlPaymentQuery, function (error) {
                                            if (error) {
                                                return connection.rollback().then(function () {
                                                    serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                                });
                                            }
                                        });
                                    }
                                    connection.commit().then(function (err) {
                                        return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: credit.id } });
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
    updatePaymentCredit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                const credit = new credit_1.Credit(body);
                var sqlQueryUpdateCredit = queries_1.queries.updatePaymentCreditQuery(credit);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        //se actualiza el credito
                        connection.query(sqlQueryUpdateCredit).then(function (result) {
                            //se Actualizan los pagos
                            var arrPayment = body.payments;
                            var payment;
                            var entry;
                            for (let i = 0; i < arrPayment.length; i++) {
                                payment = new payment_1.Payment(arrPayment[i]);
                                let sqlPaymentQuery = queries_1.queries.updatePaymentQuery(payment);
                                connection.query(sqlPaymentQuery, function (error) {
                                    if (error) {
                                        return connection.rollback().then(function () {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                        });
                                    }
                                });
                                entry = new entry_1.Entry({
                                    id: 0,
                                    amount: payment.amountRegister,
                                    typeId: 12,
                                    creditId: 0,
                                    paymentId: payment.id
                                });
                                let sqlEntry = queries_1.queries.createEntryPaymentQuery(entry);
                                connection.query(sqlEntry, function (error) {
                                    if (error) {
                                        return connection.rollback().then(function () {
                                            serviceResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'ocurrio un error inesperado, contacte al administrador');
                                            return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(serviceResponse);
                                        });
                                    }
                                });
                            }
                            connection.commit().then(function (err) {
                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: credit.id } });
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
    deleteCredit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            let sqlQuery = queries_1.queries.deleteCreditQuery(id);
            yield connectionDB_1.default.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    let errorResponse;
                    if (error.errno == sqlcodes_1.SqlCode.ER_DUP_ENTRY) {
                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ER_DUP_ENTRY, 'El credito no se encuentra registrado');
                    }
                    else {
                        errorResponse = new service_response_1.ServiceResponse(sqlcodes_1.SqlCode.ZERO, 'undefinied');
                    }
                    return response.status(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
                }
                else {
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: { message: 'Credito Eliminado con éxito' } });
                }
            });
        });
    }
    getSummary(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let today = new Date();
            let year = today.getFullYear();
            let mount = today.getMonth() + 1;
            let day = today.getDate();
            let formatDay = (String('0').repeat(2) + String(day)).slice(String(day).length);
            let formatMount = (String('0').repeat(2) + String(mount)).slice(String(mount).length);
            let strToday = today.getFullYear() + '-' + formatMount + '-' + formatDay;
            let strMount = today.getFullYear() + '-' + formatMount + '-01';
            //const sqlQuery = queries.getSumaryCredit(strToday, strMount);
            //console.log(sqlQuery);
            const sqlCreditMount = queries_1.queries.getSumaryCreditMount(strToday, strMount);
            const sqlCreditDay = queries_1.queries.getSumaryCreditDay(strToday, strMount);
            const sqlPayMount = queries_1.queries.getSumaryPayMount(strToday, strMount);
            const sqlPayDaily = queries_1.queries.getSumaryPayDay(strToday, strMount);
            // const listhistory = await database.query(sqlQuery);
            const listCreditMount = yield connectionDB_1.default.query(sqlCreditMount);
            const listCreditDay = yield connectionDB_1.default.query(sqlCreditDay);
            const listPayMount = yield connectionDB_1.default.query(sqlPayMount);
            const listPayDaily = yield connectionDB_1.default.query(sqlPayDaily);
            // if (listhistory.length >= 4) {
            try {
                let mountForCollectec = util_1.isNull(listPayMount[0].amount) ? 0 : listPayMount[0].amount;
                let mountCollect = util_1.isNull(listPayMount[0].amountInt) ? 0 : listPayMount[0].amountInt;
                let res = mountForCollectec - mountCollect;
                let data = {
                    dailyCredit: util_1.isNull(listCreditDay[0].amount) ? 0 : listCreditDay[0].amount,
                    dailyCreditInt: util_1.isNull(listCreditDay[0].amountInt) ? 0 : listCreditDay[0].amountInt,
                    dailyForCollect: util_1.isNull(listPayDaily[0].amount) ? 0 : listPayDaily[0].amount,
                    dailyCollect: util_1.isNull(listPayDaily[1].amount) ? 0 : listPayDaily[1].amount,
                    mountCredit: util_1.isNull(listCreditMount[0].amount) ? 0 : listCreditMount[0].amount,
                    mountCreditInt: util_1.isNull(listCreditMount[0].amountInt) ? 0 : listCreditMount[0].amountInt,
                    mountForCollect: res,
                    mountCollect: util_1.isNull(listPayMount[0].amountInt) ? 0 : listPayMount[0].amountInt
                };
                return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: data });
            }
            catch (error) {
                // let serviceResponse: ServiceResponse  = new ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                // return response.json(serviceResponse);
                return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: {
                        dailyCredit: 0,
                        dailyCreditInt: 0,
                        dailyForCollect: 0,
                        dailyCollect: 0,
                        mountCredit: 0,
                        mountCreditInt: 0,
                        mountForCollect: 0,
                        mountCollect: 0
                    } });
            }
        });
    }
}
exports.creditService = new CreditService();
