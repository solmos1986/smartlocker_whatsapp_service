const db = require('../config/database');

const getBuildings = async (apiType, buildingId = null) => {

    let sql = `
        SELECT
            b.building_id,
            b.company_id,
            b.buildingName,
            b.code,
            b.token,
            a.api_type,
            a.api_url
        FROM building b
        INNER JOIN apis a
            ON a.api_type = ?
    `;

    const params = [apiType];
  
    if (buildingId) {

        sql += ` WHERE b.building_id = ?`;

        params.push(buildingId);

    }

    const [rows] = await db.query(sql, params);

    return rows;

};

module.exports = {
    getBuildings
};