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
const PaymentType_1 = require("../model/PaymentType");
//import config from '../config';
class CatalogService {
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = queries_1.queries.getAllPaymens();
            const lisPayment = yield connectionDB_1.default.query(sqlQuery);
            if (lisPayment.length > 0) {
                try {
                    let listAllPayments = new Array();
                    for (let index = 0; index < lisPayment.length; index++) {
                        listAllPayments.push({
                            id: lisPayment[index].id,
                            name: lisPayment[index].name,
                            rate: lisPayment[index].rate,
                            dayToSum: lisPayment[index].numberOfDays,
                            numberOfCuotes: lisPayment[index].cuote,
                            unableSaturday: lisPayment[index].unableSaturday,
                            unableSunday: lisPayment[index].unableSunday
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllPayments });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: lisPayment });
        });
    }
    listPaymentype(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = request.params;
            var id = params.id;
            const sqlQuery = queries_1.queries.getEntryTypeByType(id);
            const listPaymentType = yield connectionDB_1.default.query(sqlQuery);
            if (listPaymentType.length > 0) {
                try {
                    let listAllPaymentType = new Array();
                    for (let index = 0; index < listPaymentType.length; index++) {
                        listAllPaymentType.push({
                            id: listPaymentType[index].id,
                            name: listPaymentType[index].name,
                            isEntryIn: listPaymentType[index].isEntryIn
                        });
                    }
                    return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listAllPaymentType });
                }
                catch (error) {
                    let serviceResponse = new service_response_1.ServiceResponse(httpstatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Ocurrio un erro por favor contacte al administrar');
                    return response.json(serviceResponse);
                }
            }
            return response.status(httpstatus_1.HttpStatus.OK).json({ code: httpstatus_1.HttpStatus.OK, data: listPaymentType });
        });
    }
    registerPaymenType(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            let serviceResponse;
            if (body != null) {
                // console.log(body);
                const paymentType = new PaymentType_1.PaymentType(body);
                //  console.log(paymentType);
                var sqlCreditPaymentType = queries_1.queries.createPaymentTypeQuery(paymentType);
                yield connectionDB_1.default.getConnection().then(function (connection) {
                    connection.beginTransaction().then(function (err) {
                        connection.query(sqlCreditPaymentType).then(function (result) {
                            var idPaymentType = result.insertId;
                            connection.commit().then(function (err) {
                                return response.json({ code: httpstatus_1.HttpStatus.OK, data: { id: idPaymentType } });
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
}
exports.catalogService = new CatalogService();
