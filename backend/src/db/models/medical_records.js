const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const medical_records = sequelize.define(
    'medical_records',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  medical_records.associate = (db) => {

    db.medical_records.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.medical_records.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return medical_records;
};

