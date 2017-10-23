import db from '../db.js';
import { reformatUser } from '../functions';

const { Users, Subscribes, Sessions } = db().models;

module.exports = {
  get(req, res) {
    Subscribes.findAll({
      where: {
        $or: [
          {
            sender: +req.query.userID,
          },
          {
            receiver: +req.query.userID,
          },
        ],
      },
    })
      .then((subscribes) => {
        res.send(subscribes);
        res.sendStatus(200);
      });
  },
  post(req, res) {
    Sessions.findOne({
      where: { uuid: req.body.session },
      include: [{ model: Users }]
    })
      .then((session) => {
        if (
          session &&
          session.User.id === req.body.userID &&
          req.body.id !== req.body.userID
        ) {
          Subscribes.create({
            sender: req.body.userID,
            receiver: req.body.id,
          })
            .then((subscription) => {
              res.send(subscription.dataValues);
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