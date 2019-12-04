"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entry {
    constructor(data) {
        this.id = data.id;
        this.amount = data.amount;
        this.typeId = data.typeId;
        this.creditId = data.creditId;
        this.paymentId = data.paymentId;
    }
}
exports.Entry = Entry;
