const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const patients = sequelize.define(
    'patients',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

first_name: {
        type: DataTypes.TEXT,

      },

last_name: {
        type: DataTypes.TEXT,

      },

national_id: {
        type: DataTypes.TEXT,

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

  patients.associate = (db) => {

    db.patients.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.patients.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return patients;
};

