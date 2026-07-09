const buildingRepository = require('../data/building.repository');
const apiService = require('./api.service');
const userRepository = require('../data/user.repository');
const evolutionService = require('./evolution.service');

const buildSyncJobs = async (apiType, buildingId = null) => {

    const buildings = await buildingRepository.getBuildings(
        apiType,
        buildingId
    );

    const syncJobs = [];
    const skippedBuildings = [];

    for (const building of buildings) {

        if (!building.buildingName) {

            skippedBuildings.push({
                building_id: building.building_id,
                reason: 'buildingName no configurado'
            });

            continue;

        }

        if (!building.token) {

            skippedBuildings.push({
                building_id: building.building_id,
                reason: 'token no configurado'
            });

            continue;

        }

        const apiUrl = building.api_url.replace(
            ':buildingName',
            building.buildingName
        );

        syncJobs.push({

            building_id: building.building_id,

            company_id: building.company_id,

            buildingName: building.buildingName,

            code: building.code,

            token: building.token,

            api_url: apiUrl

        });

    }

    return {

        total: buildings.length,

        ready: syncJobs.length,

        skipped: skippedBuildings.length,

        syncJobs,

        skippedBuildings

    };

};

const syncUsers = async (buildingId = null) => {
   
    const jobs = await buildSyncJobs(
        'USERS',
        buildingId
    );
   
    const apiResults = [];
    const users = [];

    for (const job of jobs.syncJobs) {

        const result = await apiService.get(
            job.api_url,
            job.token
        );
       
        apiResults.push({

            building_id: job.building_id,

            buildingName: job.buildingName,

            api_url: job.api_url,

            result

        });
        
        if (
            result.success &&
            result.data?.data?.department_list
        ) {

            const departmentList =
                result.data.data.department_list;

            for (const department of departmentList) {

                for (const resident of department.residents) {

                    users.push({

                        building_id: job.building_id,

                        departmentName: department.departmentName,

                        name: resident.name,

                        phone: resident.phone

                    });

                }

            }

        }

    }
  
   const evolutionResult =
    await evolutionService.checkWhatsAppNumbers(users);

    const syncResult =
        await userRepository.syncUsers(
            evolutionResult.users
        );

    return {

        success: true,

        ...jobs,

        sync: syncResult,

        evolution: {

            success: evolutionResult.success,

            totalNumbers: evolutionResult.totalNumbers,

            totalUsers: evolutionResult.totalUsers

        }

    };

};

module.exports = {

    syncUsers,

    buildSyncJobs

};