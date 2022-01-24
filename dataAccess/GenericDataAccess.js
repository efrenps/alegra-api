import _ from 'lodash';
import { TableHints } from 'sequelize';
import { HandledError } from '../utilities/CustomError.js';

export default class GenericDataAccess {
    constructor(connection, module) {
        if (!Object.keys(connection).includes(module)) {
            throw new HandledError(`The model name ${module} is invalid`);
        }

        this.connection = connection;
        this.module = module;
    }

    async findAll(attributes, condition, order, offset, limit, include) {
        const { connection, module } = this;

        return connection[module].findAll({
            attributes,
            where: condition,
            offset,
            limit,
            order,
            returning: true,
            raw: !include,
            include,
            tableHint: TableHints.NOLOCK,
        });
    }


    async findOne(attributes, condition, include) {
        const { connection, module } = this;
        return connection[module].findOne({
            attributes,
            where: condition,
            returning: true,
            raw: !include,
            include,
            tableHint: TableHints.NOLOCK,
        });
    }

    async findOneWithTransaction(attributes, condition, transaction) {
        const { connection, module } = this;
        return connection[module].findOne({
            attributes,
            where: condition,
            returning: true,
            raw: true,
            transaction,
            tableHint: TableHints.NOLOCK,
        });
    }

    async create(record) {
        const { connection, module } = this;

        return connection[module].create(record);
    }

    async createWithTransaction(record, transaction) {
        const { connection, module } = this;

        return connection[module].create(record, {
            returning: true,
            transaction,
        });
    }

    async update(parameters, condition) {
        const { connection, module } = this;

        if (_.isEmpty(condition)) {
            return new HandledError('You can not update all record, please review condition');
        }

        const update = connection[module].update(parameters, { where: condition });

        return update;
    }

    async updateWithTransaction(parameters, condition, transaction) {
        const { connection, module } = this;

        if (_.isEmpty(condition)) {
            return new UnhandledError('You can not update all record, please review condition');
        }

        return connection[module].update(parameters, {
            where: condition,
            transaction,
            returning: true,
            raw: true,
        });
    }

    async increment(field, quantity, condition) {
        const { connection, module } = this;

        if (_.isEmpty(condition)) {
            return new UnhandledError('You can not update all record, please review condition');
        }

        return connection[module].increment(
            field,
            {
                by: quantity,
                where: condition
            }
        );
    }


    async incrementWithTransaction(field, quantity, condition, transaction) {
        const { connection, module } = this;

        if (_.isEmpty(condition)) {
            return new UnhandledError('You can not update all record, please review condition');
        }

        return connection[module].increment(
            field,
            {
                by: quantity,
                where: condition,
                transaction
            }
        );
    }

    async decrementWithTransaction(field, quantity, condition, transaction) {
        const { connection, module } = this;

        if (_.isEmpty(condition)) {
            return new UnhandledError('You can not update all record, please review condition');
        }

        return connection[module].decrement(
            field,
            {
                by: quantity,
                where: condition,
                transaction,
            }
        );
    }

    async destroy(condition, transaction = null) {
        const { connection, module } = this;

        return connection[module].destroy({
            transaction,
            where: condition,
            returning: true,
        });
    }

}