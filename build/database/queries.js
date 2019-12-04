"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Clase encargada de construir las consultas para obtener las consultas de base de datos
 */
class Queries {
    createPaymentTypeQuery(paymentType) {
        return "INSERT INTO `pagosdb`.`tbltipo_cobro`"
            + " (`tip_id`,"
            + " `tip_nombre`,"
            + " `tip_interes`,"
            + " `tip_dias`,"
            + " `tip_cuotas`,"
            + " `tip_unable_saturday`,"
            + " `tip_unable_sunday`)"
            + " VALUES"
            + " (NULL,"
            + " '" + paymentType.name + "',"
            + " " + paymentType.rate + ","
            + " " + paymentType.dayToSum + ","
            + " " + paymentType.numberOfCuotes + ","
            + " " + paymentType.unableSaturday + ","
            + " " + paymentType.unableSunday + ")";
    }
    getCapitalQuery() {
        return "SELECT SUM(mov.mov_monto) as entradas "
            + " FROM tblmovimiento mov "
            + " inner join tbltipo_movimiento tm on mov.mov_tipomovimiento = tm.tip_id"
            + " where tm.tip_es_entrada = 1 OR tm.tip_es_entrada = 3"
            + " UNION ALL"
            + " SELECT SUM(mov.mov_monto) as salidas "
            + " FROM tblmovimiento mov "
            + " inner join tbltipo_movimiento tm on mov.mov_tipomovimiento = tm.tip_id"
            + " where tm.tip_es_entrada = 0 OR tm.tip_es_entrada = 2"
            + " UNION ALL"
            + " SELECT SUM(pag.pag_valor) as pagos FROM tblpago pag"
            + " inner join tblprestamo pre on pag.pag_prestamo = pre.pre_id"
            + " where pre.pre_estado_id <> 2 ";
    }
    getAllEntriesQuery() {
        return "SELECT mov.mov_id as id, mov.mov_monto as amount, mov.mov_sede as sede, mov.mov_fecha as creationDate,"
            + " tm.tip_id as tmId, tm.tip_nombre as tmName, tm.tip_es_entrada isEntryIn "
            + " FROM tblmovimiento mov "
            + " inner join tbltipo_movimiento tm on mov.mov_tipomovimiento = tm.tip_id"
            + " UNION "
            + " SELECT mov.mov_id as id, mov.mov_monto as amount, mov.mov_sede as sede, mov.mov_fecha as creationDate,"
            + " tm.tip_id as tmId, per.per_nombre as tmName, tm.tip_es_entrada isEntryIn "
            + " FROM tblmovimiento mov "
            + " inner join tbltipo_movimiento tm on mov.mov_tipomovimiento = tm.tip_id"
            + " inner join tblprestamo pre on mov.mov_prestamo = pre.pre_id"
            + " inner join tblpersona per on pre.pre_id = per.per_id"
            + " UNION"
            + " SELECT mov.mov_id as id, mov.mov_monto as amount, mov.mov_sede as sede, mov.mov_fecha as creationDate,"
            + " tm.tip_id as tmId, per.per_nombre as tmName, tm.tip_es_entrada isEntryIn "
            + " FROM tblmovimiento mov "
            + " inner join tbltipo_movimiento tm on mov.mov_tipomovimiento = tm.tip_id"
            + " inner join tblpago pag on mov.mov_cobro = pag.pag_id"
            + " inner join tblprestamo pre on  pre.pre_id = pag.pag_prestamo"
            + " inner join tblpersona per on pre.pre_id = per.per_id";
    }
    createEntryQuery(entry) {
        return "INSERT INTO tblmovimiento (mov_id, mov_monto, mov_tipomovimiento, mov_sede) "
            + " VALUES (NULL, '" + entry.amount + "', '" + entry.typeId + "', 1)";
    }
    createEntryCreditQuery(entry) {
        return "INSERT INTO tblmovimiento (mov_id, mov_monto, mov_tipomovimiento, mov_sede, mov_prestamo) "
            + " VALUES (NULL, '" + entry.amount + "', '" + entry.typeId + "', 1," + entry.creditId + ")";
    }
    createEntryPaymentQuery(entry) {
        return "INSERT INTO tblmovimiento (mov_id, mov_monto, mov_tipomovimiento, mov_sede, mov_cobro) "
            + " VALUES (NULL, '" + entry.amount + "', '" + entry.typeId + "', 1," + entry.paymentId + ")";
    }
    updateEntryCreditQuery(amount, id) {
        return "UPDATE tblmovimiento"
            + " SET "
            + " mov_monto = '" + amount + "'"
            + " WHERE mov_prestamo = " + id;
    }
    updateEntryQuery(entry) {
        return "UPDATE tblmovimiento"
            + " SET "
            + " mov_monto = '" + entry.amount + "',"
            + " mov_tipomovimiento = " + entry.typeId + ""
            + " WHERE mov_id = " + entry.id;
    }
    getEntryTypeByType(type) {
        return "SELECT tip_id as id, tip_nombre as name, tip_es_entrada as isEntryIn FROM tbltipo_movimiento where tip_es_entrada =" + type;
    }
    getAllPaymens() {
        return "SELECT tip_id as id, tip_nombre as name, tip_interes as rate, tip_dias as numberOfDays, tip_cuotas as cuote, tip_unable_saturday as unableSaturday, tip_unable_sunday as unableSunday FROM tbltipo_cobro";
    }
    createUserQuery(user) {
        return "INSERT INTO tblusuario (usu_id, usu_nombre, usu_passwork, usu_rol, usu_persona)" +
            "VALUES (NULL, '" + user.name + "', '" + user.password + "', " + user.rolId + ", " + user.personId + ")";
    }
    updateUserQuery(id, email, password) {
        return "UPDATE tblusuario SET "
            + "usu_nombre='" + email + "'"
            + ", usu_passwork='" + password + "'"
            + " WHERE usu_persona= " + id;
    }
    getUserIdbyPersonId(id) {
        return "SELECT usu_id as id FROM tblusuario where usu_persona = " + id;
    }
    createPersonQuery(person, rerefenceId) {
        let ref = (rerefenceId == 0) ? "NULL" : "" + rerefenceId;
        return "INSERT INTO tblpersona (per_id, per_nombre, per_identificacion, per_telefono, per_celular, per_correo, per_direccion, per_ciudad , per_sede, per_status, referencia_per_id)" +
            "VALUES (NULL, '" + person.fullname + "', '" + person.identification + "', '" + person.homeNumber + "', '" + person.mobileNumber + "', '" + person.email + "', '" + person.address + "', '" + person.city + "', 1, " + person.status + "," + ref + ")";
    }
    updatePersonQuery(person) {
        return "UPDATE tblpersona SET"
            + " per_nombre= '" + person.fullname + "',"
            + " per_identificacion= '" + person.identification + "',"
            + " per_telefono= '" + person.homeNumber + "',"
            + " per_celular= '" + person.mobileNumber + "',"
            + " per_correo= '" + person.email + "',"
            + " per_direccion= '" + person.address + "',"
            + " per_ciudad= '" + person.city + "',"
            + " per_status= " + person.status
            + " WHERE per_id = " + person.id;
    }
    createClientListQuery() {
        return "select (SELECT count(pre.pre_id) FROM tblprestamo pre WHERE pre.pre_persona = per.per_id AND pre.pre_estado_id = 1) as prestamos, per.per_id as id, per.per_nombre as nombre, per.per_correo as email, per.per_identificacion as identificacion, per.per_direccion as direccion, per.per_celular as celular, per.per_telefono as telefono, per.per_ciudad as ciudad, per.per_status as status, "
            + " ref.per_id as refid, ref.per_nombre as refnombre, ref.per_identificacion as refidentificacion, ref.per_celular as refcelular, ref.per_direccion as refdireccion "
            + " from tblpersona per "
            + " inner join tblpersona ref on per.referencia_per_id = ref.per_id";
    }
    getAllCreditByClientQuery(id) {
        return "select pre.pre_capital as capital , pe.est_nombre as state,"
            + " (select count(pag.pag_id) from tblpago pag "
            + "   where  pag.pag_fecha_registro IS NOT NULL"
            + "  AND date(pag.pag_fecha) != date(pag.pag_fecha_registro) AND pag.pag_prestamo = pre.pre_id) as delay "
            + "  from tblprestamo pre"
            + "  join tblestados_prestamo pe on pre.pre_estado_id = pe.est_id"
            + "  where pre.pre_persona = " + id;
    }
    getAllCreditQuery() {
        return "SELECT DISTINCT (SELECT COUNT(pag.pag_id) FROM tblpago pag where pag.pag_valor_pagado != '0' AND pag.pag_prestamo = pre.pre_id) as pagosHechos, pre.pre_id as id, pre.pre_fecha_inicio as fechaInicio, pre.pre_fecha_fin as fechaFin, pre_capital as capital,"
            + " per.per_id as clientId, per.per_nombre as cliente, per.per_celular as cellphone, cob.per_id as cobradoId, cob.per_nombre as cobrador,"
            + " tc.tip_id as cobroId, tc.tip_cuotas as cuotas, tc.tip_interes as interes, tc.tip_nombre as tipocobro, tc.tip_dias as dias,"
            + " ep.est_id as estadoId, ep.est_nombre estado "
            + " FROM tblprestamo pre"
            + " inner join tblpersona per on pre.pre_persona = per.per_id"
            + " inner join tblpersona cob on pre.pre_cobrador = cob.per_id"
            + " inner join tblpago pag on pre_id = pag_prestamo"
            + " inner join tbltipo_cobro tc on pre_tipocobro = tc.tip_id"
            + " inner join tblestados_prestamo ep on pre.pre_estado_id = ep.est_id";
        // + " where ep.est_nombre = 'ACTIVO';"
    }
    getAllCreditByAgentQuery(id) {
        return "SELECT DISTINCT (SELECT COUNT(pag.pag_id) FROM tblpago pag where pag.pag_valor_pagado != 0 AND pag.pag_fecha < curdate() AND  pag.pag_prestamo = pre.pre_id ) as pagosHechos,"
            + " (SELECT sum(pag2.pag_valor_pagado) FROM tblpago pag2 "
            + " where date(pag2.pag_fecha_registro) = date(curdate()) AND pag2.pag_prestamo = pre.pre_id) as sumPayments,"
            + " pre.pre_id as id, pre.pre_fecha_inicio as fechaInicio, pre.pre_fecha_fin as fechaFin, pre_capital as capital,"
            + " per.per_id as clientId, per.per_nombre as cliente, per.per_celular as cellphone, per.per_direccion as addresss, cob.per_id as cobradoId, cob.per_nombre as cobrador,"
            + " tc.tip_id as cobroId, tc.tip_cuotas as cuotas, tc.tip_interes as interes, tc.tip_nombre as tipocobro, tc.tip_dias as dias,"
            + " ep.est_id as estadoId, ep.est_nombre estado "
            + " FROM tblprestamo pre"
            + " inner join tblpersona per on pre.pre_persona = per.per_id"
            + " inner join tblpersona cob on pre.pre_cobrador = cob.per_id"
            + " inner join tblusuario usu on cob.per_id = usu.usu_persona"
            + " inner join tblpago pag on pre_id = pag_prestamo"
            + " inner join tbltipo_cobro tc on pre_tipocobro = tc.tip_id"
            + " inner join tblestados_prestamo ep on pre.pre_estado_id = ep.est_id"
            + " where ep.est_nombre = 'ACTIVO' AND usu.usu_id = " + id;
    }
    getAllPaymentByCredit(id) {
        return "SELECT pag_id as id, pag_valor as amount, pag_fecha as dateOfPay, pag_observacion as observation,"
            + " pag_prestamo as creditId, pag_latitud as latitude, pag_logitud as longitude, pag_valor_pagado as amountRegister, pag_fecha_registro as dateOfRegister"
            + " FROM tblpago where pag_prestamo = " + id;
    }
    createCreditQuery(credit) {
        return "INSERT INTO tblprestamo (pre_fecha_inicio, pre_fecha_fin, pre_capital, pre_persona, pre_estado_id, pre_tipocobro, pre_cobrador) "
            + " VALUES ('" + credit.startDate + "', '" + credit.endDate + "', '" + credit.amount + "', " + credit.client + ", " + credit.stateId + ", " + credit.paymentType + ", " + credit.agent + ");        ";
    }
    updateCreditQuery(credit) {
        return "UPDATE tblprestamo SET"
            + " pre_fecha_inicio= '" + credit.startDate + "',"
            + " pre_fecha_fin= '" + credit.endDate + "',"
            + " pre_capital= '" + credit.amount + "',"
            + " pre_persona= " + credit.client + ","
            + " pre_estado_id= " + credit.stateId + ","
            + " pre_tipocobro= " + credit.paymentType + ","
            + " pre_cobrador= " + credit.agent + ""
            + " WHERE pre_id = " + credit.id;
    }
    updatePaymentCreditQuery(credit) {
        return "UPDATE tblprestamo SET"
            + " pre_estado_id= " + credit.stateId + ""
            + " WHERE pre_id = " + credit.id;
    }
    deleteCreditQuery(id) {
        return "DELETE FROM tblprestamo WHERE pre_id = " + id;
    }
    closeCreditQuery(creditId) {
        return "UPDATE tblprestamo SET"
            + " pre_estado_id = 2"
            + " WHERE pre_id = " + creditId;
    }
    createPaymentQuery(payment, idCredit) {
        return "INSERT INTO tblpago (pag_valor, pag_fecha, pag_prestamo)"
            + " VALUES ('" + payment.amount + "', '" + payment.dateOfPay + "', " + idCredit + ");";
    }
    updatePaymentQuery(payment) {
        return "UPDATE tblpago"
            + " SET"
            + " pag_observacion = '" + payment.observation + "',"
            + " pag_latitud = " + payment.latitude + ","
            + " pag_logitud = " + payment.longitude + ","
            + " pag_valor_pagado = '" + payment.amountRegister + "',"
            + " pag_fecha_registro = '" + payment.dateOfRegister + "'"
            + " WHERE pag_id = " + payment.id;
    }
    deletePayments(creditId) {
        return "DELETE FROM tblpago where pag_prestamo = " + creditId;
    }
    getRoleAgentQuery() {
        return "SELECT rol_id as id FROM tblrol where rol_codigo = 'COBRADOR'";
    }
    /**
     * consulta a un usuario por su email
     *
     */
    getUserByEmail(email) {
        return "select  us.usu_id as id, us.usu_passwork as passwork, us.usu_nombre as usuario, per.per_nombre as nombre, per.per_identificacion as identificacion, per.per_direccion as direccion, per.per_celular as celular, per.per_telefono as telefono, per.per_ciudad as ciudad, rol.rol_codigo as codigorol " +
            "from tblusuario us " +
            "join tblpersona per on us.usu_persona = per.per_id " +
            "join tblrol rol on us.usu_rol = rol.rol_id " +
            "where us.usu_nombre = '" + email + "'";
    }
    /**
     *
     * @param id Permite altualizar el password para un usuario
     * @param password
     */
    updatePassword(id, password) {
        return "UPDATE tblusuario SET "
            + "usu_passwork='" + password + "'"
            + " WHERE usu_id= " + id;
    }
    getAllAgentByZone() {
        return "select  (select count(pre.pre_id) from tblprestamo pre where pre.pre_cobrador = per.per_id) as numPrestamos, "
            + " per.per_id as id, us.usu_passwork as passwork, us.usu_nombre as usuario, per.per_nombre as nombre, per.per_identificacion as identificacion, per.per_direccion as direccion, per.per_celular as celular, per.per_telefono as telefono, per.per_ciudad as ciudad, per.per_status as status, rol.rol_codigo as codigorol "
            + " from tblusuario us "
            + " join tblpersona per on us.usu_persona = per.per_id "
            + " join tblrol rol on us.usu_rol = rol.rol_id "
            + " where rol.rol_codigo = 'COBRADOR' AND per.per_sede = 1 AND per.per_status = 1 ";
    }
    deleteUserQuery(id) {
        return "DELETE FROM tblpersona WHERE per_id = " + id;
    }
    getAgentHistoryQuery(id) {
        return "SELECT distinct pag.pag_id as id, cli.per_nombre as clientName, pag.pag_fecha_registro as amountDate, pag.pag_valor_pagado as amount, pag.pag_latitud as latitude, pag.pag_logitud as longuitude"
            + " FROM tblpersona per"
            + " join tblprestamo pre on per.per_id = pre.pre_cobrador"
            + " join tblpersona cli on pre.pre_persona = cli.per_id"
            + " join tblpago pag on pre.pre_id = pag.pag_prestamo"
            + " where per.per_id = " + id + " and pag.pag_valor_pagado != 0";
    }
    getSumaryCredit(today, first) {
        return "SELECT SUM(pre.pre_capital) as amount, SUM(pre.pre_capital + ((pre.pre_capital * tc.tip_interes) / 100)) as amountInt FROM tblprestamo pre "
            + " join tbltipo_cobro tc on pre.pre_tipocobro = tc.tip_id"
            + " where date(pre.pre_fecha_creacion) >= date('" + first + "')"
            + " union"
            + " SELECT SUM(pre.pre_capital), SUM(pre.pre_capital + ((pre.pre_capital * tc.tip_interes) / 100)) FROM tblprestamo pre "
            + " join tbltipo_cobro tc on pre.pre_tipocobro = tc.tip_id"
            + " where date(pre.pre_fecha_creacion) = date('" + today + "')"
            + " union"
            + " SELECT SUM(pag.pag_valor), SUM(pag.pag_valor_pagado) FROM tblpago pag"
            + " where date(pag.pag_fecha) >= date('" + first + "')"
            + " union"
            + " SELECT SUM(pag.pag_valor), SUM(pag.pag_valor_pagado) FROM tblpago pag"
            + " where date(pag.pag_fecha) = date('" + today + "')";
    }
    getSumaryCreditMount(today, first) {
        return "SELECT SUM(pre.pre_capital) as amount, SUM(pre.pre_capital + ((pre.pre_capital * tc.tip_interes) / 100)) as amountInt FROM tblprestamo pre "
            + " join tbltipo_cobro tc on pre.pre_tipocobro = tc.tip_id"
            + " where date(pre.pre_fecha_creacion) >= date('" + first + "')";
    }
    getSumaryCreditDay(today, first) {
        return "SELECT SUM(pre.pre_capital) as amount, SUM(pre.pre_capital + ((pre.pre_capital * tc.tip_interes) / 100)) as amountInt FROM tblprestamo pre "
            + " join tbltipo_cobro tc on pre.pre_tipocobro = tc.tip_id"
            + " where date(pre.pre_fecha_creacion) = date('" + today + "')";
    }
    getSumaryPayMount(today, first) {
        return "SELECT SUM(pag.pag_valor) as amount, SUM(pag.pag_valor_pagado) as amountInt FROM tblpago pag"
            + " where date(pag.pag_fecha) >= date('" + first + "')";
    }
    getSumaryPayDay(today, first) {
        return "SELECT SUM(pag.pag_valor) as amount FROM tblpago pag where date(pag.pag_fecha) = date('" + today + "') AND pag.pag_valor_pagado = 0"
            + " UNION"
            + " SELECT SUM(pag.pag_valor_pagado) as amountInt FROM tblpago pag where date(pag.pag_fecha_registro) = date('" + today + "')";
        //"SELECT SUM(pag.pag_valor) as amount, SUM(pag.pag_valor_pagado) as amountInt FROM tblpago pag"
        //+ " where date(pag.pag_fecha) = date('"+today+"')";
    }
}
exports.queries = new Queries();
