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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
function sendMail(to, subject, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
            secure: false,
            auth: {
                user: process.env.MAILER_EMAIL_ID || config_1.default.ADMIN_ACCOUNT,
                pass: process.env.MAILER_PASSWORD || config_1.default.ADMIN_ACCOUNT_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailOptions = {
            from: config_1.default.ADMIN_ACCOUNT,
            to: to,
            subject: subject,
            html: content
        };
        yield transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('error al enviar correo', err);
            }
            else {
                console.log('Email enviado:' + info.respose);
            }
        });
    });
}
exports.sendMail = sendMail;
