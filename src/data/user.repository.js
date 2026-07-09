const db = require('../config/database');

const getDepartmentMap = async (connection) => {

    const [rows] = await connection.query(`
        SELECT
            department_id,
            building_id,
            name
        FROM department
        WHERE state = 1
    `);

    const departmentMap = {};

    for (const row of rows) {

        const key = `${row.building_id}|${row.name}`;

        departmentMap[key] = row.department_id;

    }

    return departmentMap;

};

const syncUsers = async (users) => {

    if (!users || users.length === 0) {

        return {
            success: false,
            message: 'No existen usuarios para sincronizar.'
        };

    }

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const departmentMap =
            await getDepartmentMap(connection);

        await connection.query(`
            DELETE FROM user
        `);

        let inserted = 0;

        const skippedUsers = [];

        for (const user of users) {

            const key =
                `${user.building_id}|${user.departmentName}`;

            const departmentId =
                departmentMap[key];

            if (!departmentId) {

                skippedUsers.push({

                    building_id: user.building_id,

                    departmentName: user.departmentName,

                    name: user.name,

                    phone: user.phone,

                    reason: 'Departamento no existe'

                });

                continue;

            }

            await connection.query(

                `
                INSERT INTO user
                (
                    department_id,
                    name,
                    celular,
                    state,
                    has_whatsapp
                )
                VALUES
                (
                    ?, ?, ?, 1, ?
                )
                `,

                [

                    departmentId,

                    user.name,

                    user.phone,

                    user.has_whatsapp

                ]

            );

            inserted++;

        }

        await connection.commit();

        return {

            success: true,

            inserted,

            skipped: skippedUsers.length,

            skippedUsers

        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

module.exports = {

    syncUsers

};