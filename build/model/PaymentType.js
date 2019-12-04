"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentType {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.rate = data.rate;
        this.dayToSum = data.dayToSum;
        this.numberOfCuotes = data.numberOfCuotes;
        this.unableSaturday = data.unableSaturday;
        this.unableSunday = data.unableSunday;
    }
}
exports.PaymentType = PaymentType;
