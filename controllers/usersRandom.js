import db from '../db.js';
import { reformatUser, compareRandom } from '../functions';

const { Users } = db().models;

module.exports = {
  name: 'users/random',
  get(req, res) {
    Users.findAll({})
      .then((users) => {
        let randomUsers = users.slice();
        res.send(randomUsers
          .sort(compareRandom)
          .filter(u => u.id !== +req.query.besides)
          .slice(0, +req.query.amount)
          .map(u => reformatUser(u)));
        res.sendStatus(200);
      });
  }
};