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
    messages: {
      type: DataType.ARRAY(DataType.JSON),
      defaultValue: [],
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        console.log('Inside the Dialogs');
        Dialogs.belongsTo(models.Users);
        Dialogs.hasMany(models.Messages);
      },
    },
  });

  return Dialogs;
};