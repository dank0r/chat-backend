import db from '../db.js';
import { reformatUser } from '../functions';

const { Users, Sessions } = db().models;

module.exports = {
  get(req, res) {
    Users.findOne({
      where: {
        id: +req.query.id,
      },
    })
      .then((user) => {
        res.send(reformatUser(user));
        res.sendStatus(200);
      });
  }
};