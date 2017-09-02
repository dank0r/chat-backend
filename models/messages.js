module.exports = (sequelize, DataType) => {
  const Messages = sequelize.define('Messages', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataType.STRING,
      allowNull: true,
      unique: false,
      defaultValue: '',
    },
    author: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
      unique: false,
    },
    viewedBy: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    dialogID: {
      type: DataType.INTEGER,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: (models) => {
        Messages.belongsTo(models.Dialogs);
      },
    },
  });

  return Messages;
};