module.exports = (sequelize, DataType) => {
  const Sessions = sequelize.define('Sessions', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    uuid: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      unique: true,
    },
  });

  return Sessions;
};