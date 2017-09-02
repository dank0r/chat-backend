module.exports = (sequelize, DataType) => {
  const Dialogs = sequelize.define('Dialogs', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: true,
      unique: false,
      defaultValue: '',
    },
    creator: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    participants: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    messages: {
      type: DataType.ARRAY(DataType.JSON),
      defaultValue: [],
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        Dialogs.belongsTo(models.Users);
        Dialogs.hasMany(models.Messages);
      },
    },
  });

  return Dialogs;
};