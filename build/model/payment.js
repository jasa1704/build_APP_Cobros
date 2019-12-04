"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Payment {
    constructor(data) {
        this.id = data.id;
        this.amount = data.amount;
        this.latitude = data.latitude;
        this.observation = data.observation;
        this.dateOfPay = this.getDate(data.dateOfPay);
        this.amountRegister = data.amountRegister;
        this.longitude = data.longitude;
        this.dateOfRegister = this.getDate(data.dateOfRegister);
    }
    getDate(strDate) {
        let millisecons = strDate.replace('/Date(', '').replace(')/', '').replace('-', ' ').replace('+', ' ').split(' ')[0];
        let date = new Date(Number(millisecons));
        return this.dateAsYYYYMMDDHHNNSS(date);
    }
    dateAsYYYYMMDDHHNNSS(date) {
        return date.getFullYear()
            + '-' + this.leftpad(date.getMonth() + 1, 2)
            + '-' + this.leftpad(date.getDate(), 2)
            + ' ' + this.leftpad(date.getHours(), 2)
            + ':' + this.leftpad(date.getMinutes(), 2)
            + ':' + this.leftpad(date.getSeconds(), 2);
    }
    leftpad(val, resultLength = 2, leftpadChar = '0') {
        return (String(leftpadChar).repeat(resultLength)
            + String(val)).slice(String(val).length);
    }
}
exports.Payment = Payment;
