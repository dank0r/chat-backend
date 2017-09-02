module.exports = (sequelize, DataType) => {
  const Posts = sequelize.define('Posts', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
      unique: false,
    },
    text: {
      type: DataType.STRING,
      defaultValue: '',
      allowNull: false,
    },
    author: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    likes: {
      type: DataType.ARRAY(DataType.INTEGER),
      defaultValue: [],
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        Posts.belongsTo(models.Users);
      },
    },
  });

  return Posts;
};