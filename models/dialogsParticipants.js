module.exports = (sequelize, DataType) => {
  const DialogsParticipants = sequelize.define('DialogsParticipants', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataType.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    dialogID: {
      type: DataType.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    isActive: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });

  return DialogsParticipants;
};