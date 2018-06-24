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
          Users.update({
            status: req.body.status,
          }, {
            where: { id: session.User.id }
          })
            .then(() => {
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