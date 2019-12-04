"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Person {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.identification = data.identification;
        this.status = data.status;
        this.fullname = data.fullname;
        this.homeNumber = data.homeNumber;
        this.mobileNumber = data.mobileNumber;
        this.address = data.address;
        this.city = data.city;
        this.sede = data.sede;
        if (util_1.isNullOrUndefined(data.reference)) {
            this.reference = {};
        }
        else {
            this.reference = new Person(data.reference);
        }
    }
}
exports.Person = Person;
