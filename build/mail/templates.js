"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Template {
    getRestorePassword(username, password) {
        return '<p>Hola ' + username + '</p>'
            + '<p>Está recibiendo este mensaje porque ha solicitado restablecer su contraseña en el sitio de Configuración de Pozos .</p>'
            + '<p>su nuevo correo temporal es: <b>' + password + '</b>  </p>'
            + '<p><b></b></p>'
            + '<p>Este correo ha sido generado automaticamente, por favor no lo responda </p>';
    }
    getRegisterAgent(email, documento, fullname) {
        return '<p>Bienvenido al sistema de gestión de cobros.</p>'
            + '<p><b>Sus Datos de Acceso son:</b></p>'
            + '<p><b></b></p>'
            + '<p><b>Nombre de usuario:</b> ' + email + '</p>'
            + '<p><b>Contraseña:</b> ' + documento + '</p>'
            + '<p><b></b></p>'
            + '<p>Este correo ha sido generado automaticamente, por favor no lo responda </p>';
    }
}
exports.template = new Template();
