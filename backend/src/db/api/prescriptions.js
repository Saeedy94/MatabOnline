
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PrescriptionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const prescriptions = await db.prescriptions.create(
            {
                id: data.id || undefined,

        tracking_code: data.tracking_code
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return prescriptions;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const prescriptionsData = data.map((item, index) => ({
                id: item.id || undefined,

                tracking_code: item.tracking_code
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const prescriptions = await db.prescriptions.bulkCreate(prescriptionsData, { transaction });

        return prescriptions;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const prescriptions = await db.prescriptions.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.tracking_code !== undefined) updatePayload.tracking_code = data.tracking_code;

        updatePayload.updatedById = currentUser.id;

        await prescriptions.update(updatePayload, {transaction});

        return prescriptions;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const prescriptions = await db.prescriptions.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of prescriptions) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of prescriptions) {
                await record.destroy({transaction});
            }
        });

        return prescriptions;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const prescriptions = await db.prescriptions.findByPk(id, options);

        await prescriptions.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await prescriptions.destroy({
            transaction
        });

        return prescriptions;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const prescriptions = await db.prescriptions.findOne(
            { where },
            { transaction },
        );

        if (!prescriptions) {
            return prescriptions;
        }

        const output = prescriptions.get({plain: true});

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

                if (filter.tracking_code) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'prescriptions',
                            'tracking_code',
                            filter.tracking_code,
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
            const { rows, count } = await db.prescriptions.findAndCountAll(queryOptions);

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
                        'prescriptions',
                        'tracking_code',
                        query,
                    ),
                ],
            };
        }

        const records = await db.prescriptions.findAll({
            attributes: [ 'id', 'tracking_code' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['tracking_code', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.tracking_code,
        }));
    }

};

