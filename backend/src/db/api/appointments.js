
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AppointmentsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const appointments = await db.appointments.create(
            {
                id: data.id || undefined,

        appointment_date: data.appointment_date
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return appointments;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const appointmentsData = data.map((item, index) => ({
                id: item.id || undefined,

                appointment_date: item.appointment_date
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const appointments = await db.appointments.bulkCreate(appointmentsData, { transaction });

        return appointments;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const appointments = await db.appointments.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.appointment_date !== undefined) updatePayload.appointment_date = data.appointment_date;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await appointments.update(updatePayload, {transaction});

        return appointments;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const appointments = await db.appointments.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of appointments) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of appointments) {
                await record.destroy({transaction});
            }
        });

        return appointments;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const appointments = await db.appointments.findByPk(id, options);

        await appointments.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await appointments.destroy({
            transaction
        });

        return appointments;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const appointments = await db.appointments.findOne(
            { where },
            { transaction },
        );

        if (!appointments) {
            return appointments;
        }

        const output = appointments.get({plain: true});

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

            if (filter.appointment_dateRange) {
                const [start, end] = filter.appointment_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    appointment_date: {
                    ...where.appointment_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    appointment_date: {
                    ...where.appointment_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
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
            const { rows, count } = await db.appointments.findAndCountAll(queryOptions);

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
                        'appointments',
                        'appointment_date',
                        query,
                    ),
                ],
            };
        }

        const records = await db.appointments.findAll({
            attributes: [ 'id', 'appointment_date' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['appointment_date', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.appointment_date,
        }));
    }

};

