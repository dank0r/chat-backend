module.exports = (sequelize, DataType) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    firstname: {
      type: DataType.STRING,
      allowNull: false,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
    lastname: {
      type: DataType.STRING,
      allowNull: false,
      unique: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dialogs: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    friends: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    subscribers: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    subscriptions: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    isOnline: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    posts: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
    status: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: '',
    },
  }, {
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.Dialogs);
      },
    },
  });

  return Users;
};