
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PatientsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const patients = await db.patients.create(
            {
                id: data.id || undefined,

        first_name: data.first_name
        ||
        null
            ,

        last_name: data.last_name
        ||
        null
            ,

        national_id: data.national_id
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return patients;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const patientsData = data.map((item, index) => ({
                id: item.id || undefined,

                first_name: item.first_name
            ||
            null
            ,

                last_name: item.last_name
            ||
            null
            ,

                national_id: item.national_id
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const patients = await db.patients.bulkCreate(patientsData, { transaction });

        return patients;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const patients = await db.patients.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.first_name !== undefined) updatePayload.first_name = data.first_name;

        if (data.last_name !== undefined) updatePayload.last_name = data.last_name;

        if (data.national_id !== undefined) updatePayload.national_id = data.national_id;

        updatePayload.updatedById = currentUser.id;

        await patients.update(updatePayload, {transaction});

        return patients;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const patients = await db.patients.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of patients) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of patients) {
                await record.destroy({transaction});
            }
        });

        return patients;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const patients = await db.patients.findByPk(id, options);

        await patients.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await patients.destroy({
            transaction
        });

        return patients;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const patients = await db.patients.findOne(
            { where },
            { transaction },
        );

        if (!patients) {
            return patients;
        }

        const output = patients.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.first_name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'patients',
                            'first_name',
                            filter.first_name,
                        ),
                    };
                }

                if (filter.last_name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'patients',
                            'last_name',
                            filter.last_name,
                        ),
                    };
                }

                if (filter.national_id) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'patients',
                            'national_id',
                            filter.national_id,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.patients.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'patients',
                        'first_name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.patients.findAll({
            attributes: [ 'id', 'first_name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['first_name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.first_name,
        }));
    }

};

