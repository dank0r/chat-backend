import db from '../db.js';
import { reformatUser } from '../functions';

const { Users, Subscribes, Sessions } = db().models;

module.exports = {
  get(req, res) {
    Subscribes.findAll({
      where: {
        $or: [
          {
            sender: +req.query.id,
          },
          {
            receiver: +req.query.id,
          },
        ],
      },
      include: [{ model: Users }],
    })
      .then((subscribes) => {
        const usersToFind = subscribes.map(sub => sub.sender === +req.query.id ? sub.receiver : sub.sender).filter((v, i, a) => a.indexOf(v) === i);
        Users.findAll({
          where: { id: usersToFind }
        })
        .then((users) => {
            res.send(subscribes.map(sub => Object.assign({}, sub.dataValues, {
              User: users.find(u => u.id === sub.sender || u.id === sub.receiver),
            })));
            res.sendStatus(200);
          });
      });
  },
  post(req, res) {
    Sessions.findOne({
      where: { uuid: req.body.session },
      include: [{ model: Users }]
    })
      .then((session) => {
        console.log('session: ', session);
        console.log('session.User.id: ', session.User.id);
        console.log('req.body.userID: ', req.body.userID);
        console.log('req.body.id: ', req.body.id);
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
  },
  delete(req, res) {
    Sessions.findOne({
      where: { uuid: req.body.session },
      include: [{ model: Users }]
    })
      .then((session) => {
        console.log('session: ', session);
        console.log('session.User.id: ', session.User.id);
        console.log('req.body.userID: ', req.body.userID);
        console.log('req.body.id: ', req.body.id);
        if (
          session &&
          session.User.id === req.body.userID &&
          req.body.id !== req.body.userID
        ) {
          Subscribes.destroy({
            where: {
              sender: req.body.userID,
              receiver: req.body.id,
            }
          })
            .then((subscription) => {
              res.send({
                sender: req.body.userID,
                receiver: req.body.id,
              });
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