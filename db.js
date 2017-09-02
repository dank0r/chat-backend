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
      config.database,
      config.username,
      config.password,
      config,
    );

    db = {
      sequelize,
      Sequelize,
      models: {},
    };

    // Загрузка моделей
    const dir = path.join(__dirname, 'models');
    fs.readdirSync(dir).forEach((file) => {
      const modelDir = path.join(dir, file);
    const model = sequelize.import(modelDir);
    db.models[model.name] = model;
  });

  /*Object.keys(db.models).forEach((key) => {
   db.models[key].associate(db.models);
   });*/
}

return db;
};