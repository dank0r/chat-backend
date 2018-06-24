import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
var config    = require(__dirname + '/libs/config.json');

/*module.exports = {
 host: 'pellefant.db.elephantsql.com',
 database: 'duavmmpp',
 username: 'duavmmpp',
 password: 'EhvRkXZu__Q9UOZzZ0n-_3IcQFwEmvG4',
 port: 5432,
 dialect: 'postgres',
 };*/

let db = null;

module.exports = (app) => {
  if (!db) {
    //onst config = app.libs.config;
    let sequelize = new Sequelize(
      process.env.db_name,
      process.env.db_username,
      process.env.db_password,
      {
        host: process.env.db_host,
        port: +process.env.db_port,
        dialect: process.env.db_dialect,
      },
    );

    db = {
      sequelize,
      Sequelize,
      models: {},
    };

    // Models upload
    const dir = path.join(__dirname, 'models');
    fs.readdirSync(dir).forEach((file) => {
      const modelDir = path.join(dir, file);
      const model = sequelize.import(modelDir);
      db.models[model.name] = model;
    });

  /*Object.keys(db.models).forEach((key) => {
    console.log('db.models: ', db.models);
    console.log('key: ', key);
    console.log('db.models[key]: ', db.models[key]);
   db.models[key].associate(db.models);
   });*/

    // ASSOCIATIONS

    //Users
    db.models.Users.hasMany(db.models.DialogsParticipants, { foreignKey: 'userID' });
    db.models.Users.hasMany(db.models.Messages, { foreignKey: 'author' });
    db.models.Users.hasOne(db.models.Sessions, { foreignKey: 'userID' });
    db.models.Users.hasMany(db.models.Subscribes, { foreignKey: 'sender' });
    db.models.Users.hasMany(db.models.Subscribes, { foreignKey: 'receiver' });

    //Subscribes
    db.models.Subscribes.belongsTo(db.models.Users, { foreignKey: 'sender', onDelete: 'CASCADE' });
    db.models.Subscribes.belongsTo(db.models.Users, { foreignKey: 'receiver', onDelete: 'CASCADE' });

    // Dialogs
    db.models.Dialogs.hasMany(db.models.Messages, { foreignKey: 'dialogID' });
    db.models.Dialogs.hasMany(db.models.DialogsParticipants, { foreignKey: 'dialogID' });

    //DialogsParticipants
    db.models.DialogsParticipants.belongsTo(db.models.Users, { foreignKey: 'userID', onDelete: 'CASCADE' });
    db.models.DialogsParticipants.belongsTo(db.models.Dialogs, { foreignKey: 'dialogID', onDelete: 'CASCADE' });

    // Messages
    db.models.Messages.belongsTo(db.models.Dialogs, { foreignKey: 'dialogID' });
    db.models.Messages.belongsTo(db.models.Users, { foreignKey: 'author' });

    // Posts
    db.models.Posts.belongsTo(db.models.Users, { foreignKey: 'author' });

    // Sessions
    db.models.Sessions.belongsTo(db.models.Users, { foreignKey: 'userID' });
}

return db;
};