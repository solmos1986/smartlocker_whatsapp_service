const db = require('../config/database');

/**
 * Busca un movimiento por código.
 */
const findMovementByCode = async (codigo) => {

    const [rows] = await db.execute(
        `
        SELECT
            movement_id,
            door_id,
            department_id,
            building_id,
            code,
            type_movement_id,
            id_ref,
            status_notificate,
            status_integrate
        FROM movement
        WHERE code = ?
        LIMIT 1
        `,
        [codigo]
    );

    return rows.length ? rows[0] : null;

};

/**
 * Obtiene los contactos activos de un departamento.
 */
const findDepartmentContacts = async (departmentId) => {
    console.log('llegue movemente repository a buscar departamento Id', departmentId);
    const [rows] = await db.execute(
        `
        SELECT
            u.user_id,
            u.name,
            u.celular,

            d.department_id,
            d.name AS department_name,

            b.building_id,
            b.name AS building_name

        FROM user u

        INNER JOIN department d
            ON u.department_id = d.department_id

        INNER JOIN building b
            ON d.building_id = b.building_id

        WHERE
            u.department_id = ?
            AND u.state = 1
            AND u.has_whatsapp = 1
        `,
        [departmentId]
    );
    console.log('contactos del departamento: ', rows);
    return rows;

};

module.exports = {
    findMovementByCode,
    findDepartmentContacts
};