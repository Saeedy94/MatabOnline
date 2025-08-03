const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const prescriptions = sequelize.define(
    'prescriptions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

tracking_code: {
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

  prescriptions.associate = (db) => {

    db.prescriptions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.prescriptions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return prescriptions;
};

