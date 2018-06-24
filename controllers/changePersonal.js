import db from '../db.js';
import { reformatUser } from '../functions';

const { Users, Subscribes, Sessions } = db().models;

module.exports = {
  put(req, res) {
    Sessions.findOne({
      where: { uuid: req.body.session },
      include: [{ model: Users }]
    })
      .then((session) => {
        if (
          session &&
          session.User.id === req.body.userID
        ) {
          Users.update(req.body.data, {
            where: { id: session.User.id }
          })
            .then((user) => {
              res.send(user);
              res.sendStatus(200);
            })
            .catch((error) => {
              res.status(412).json({msg: error.message});
            });
        } else {
          throw Error('Invalid session');
        }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  }
};