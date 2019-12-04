"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Credit {
    constructor(data) {
        this.id = data.id;
        this.startDate = this.getDate(data.startDate);
        this.endDate = this.getDate(data.endDate);
        this.amount = data.amount;
        this.paymentType = data.paymentType;
        this.agent = data.agent;
        this.client = data.client;
        this.stateId = data.stateId;
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
exports.Credit = Credit;
