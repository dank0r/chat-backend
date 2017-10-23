module.exports = (sequelize, DataType) => {
  const Subscribes = sequelize.define('Subscribes', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: {
      type: DataType.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    receiver: {
      type: DataType.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
  });

  return Subscribes;
};